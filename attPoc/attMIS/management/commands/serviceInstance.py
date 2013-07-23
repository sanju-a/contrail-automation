#!/usr/bin/python

#-----------------------------------------------------
#Script for provisioning contrail Service Instance
#Base version from contrail modified 
#Author Sanju Abraham - sanjua@juniper.net
#-----------------------------------------------------

import os
import sys
import errno
import subprocess
import time
import argparse
import servicePolicy

sys.path.insert(0, os.path.realpath('/usr/lib/python2.7/site-packages'))

from django.core.management.base import BaseCommand, CommandError
from vnc_api.vnc_api import *
from vnc_api.common import exceptions as vnc_exceptions

from optparse import make_option

class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('--delete',
            action='store_true',
            dest='delete',
            default=False,
            help='Delete poll instead of closing it'),
        )

class ServiceInstanceCmd(object):
    def __init__(self, args_str = None):
        self._args = None
        if not args_str:
            args_str = ' '.join(sys.argv[1:])
        self._parse_args(args_str)

        self._proj_fq_name = [self._args.domain_name, self._args.proj_name]
        self._si_fq_name = [self._args.domain_name, self._args.proj_name, self._args.instance_name]
        self._st_fq_name = [self._args.domain_name, self._args.template_name]
        self._domain_fq_name = [self._args.domain_name]
        if self._args.left_vn:
            self._left_vn_fq_name = [self._args.domain_name, self._args.proj_name, self._args.left_vn]
        if self._args.right_vn:
            self._right_vn_fq_name = [self._args.domain_name, self._args.proj_name, self._args.right_vn]

        self._vnc_lib = VncApi('u', 'p', 
                         api_server_host = self._args.api_server_ip, 
                         api_server_port = self._args.api_server_port)
    #end __init__

    def _parse_args(self, args_str):
        # Source any specified config/ini file
        # Turn off help, so we print all options in response to -h
        conf_parser = argparse.ArgumentParser(add_help = False)
        
        conf_parser.add_argument("-c", "--conf_file",
                                 help="Specify config file", metavar="FILE")
        args, remaining_argv = conf_parser.parse_known_args(args_str.split())

        global_defaults = {
            'domain_name'     : 'default-domain',
            'template_name'   : None,
            'instance_name'   : None,
            'proj_name'       : 'demo',
            'mgmt_vn'         : None,
            'left_vn'         : None,
            'right_vn'        : None,
            'api_server_ip'   : '127.0.0.1',
            'api_server_port' : '8082',
            'policy_name'     : None,
        }

        if args.conf_file:
            self._conf_file = args.conf_file
            config = ConfigParser.SafeConfigParser()
            config.read([args.conf_file])
            global_defaults.update(dict(config.items("DEFAULTS")))

        # Override with CLI options
        # Don't surpress add_help here so it will handle -h
        parser = argparse.ArgumentParser(
            # Inherit options from config_parser
            parents=[conf_parser],
            # print script description with -h/--help
            description=__doc__,
            # Don't mess with format of description
            formatter_class=argparse.RawDescriptionHelpFormatter,
            )

        parser.set_defaults(**global_defaults)
        subparsers = parser.add_subparsers()

        create_parser = subparsers.add_parser('add')
        create_parser.add_argument("instance_name", help = "service instance name")
        create_parser.add_argument("template_name", help = "service template name")
        create_parser.add_argument("--proj_name", help = "name of project [default: demo]")
        create_parser.add_argument("--mgmt_vn", help = "name of management vn [default: none]")
        create_parser.add_argument("--left_vn", help = "name of left vn [default: none]")
        create_parser.add_argument("--right_vn", help = "name of right vn [default: none]")
        create_parser.add_argument("--max_instances", type = int,  default = 1,
                                   help = "max instances to launch [default: 1]")
        create_parser.add_argument("--auto_scale", action = "store_true", default = False,
                                   help = "enable auto-scale from 1 to max_instances")
        create_parser.add_argument("policy_name", help = "network policy name")
        create_parser.set_defaults(func = self.create_si)

        delete_parser = subparsers.add_parser('del')
        delete_parser.add_argument("instance_name", help = "service instance name")
        delete_parser.add_argument("template_name", help = "service instance name")
        delete_parser.add_argument("policy_name", help = "network policy name")
        delete_parser.add_argument("--proj_name", help = "name of project [default: demo]")
        delete_parser.set_defaults(func = self.delete_si)

        self._args = parser.parse_args(remaining_argv)
    #end _parse_args

    #create service instance
    def create_si(self):
        #get service template
        try:
            st_obj = self._vnc_lib.service_template_read(fq_name=self._st_fq_name)
            st_prop = st_obj.get_service_template_properties()
            if st_prop == None:
                print "Error: Service template %s properties not found" % (self._args.template_name)
                return
        except NoIdError:
            return "Error: Service template %s not found" % (self._args.template_name)

        #check if passed VNs exist
        if self._args.left_vn:
            try:
                self._vnc_lib.virtual_network_read(fq_name = self._left_vn_fq_name)
            except NoIdError:
                print "Error: Left VN %s not found" % (self._left_vn_fq_name)
                return
        if self._args.right_vn:
            try:
                self._vnc_lib.virtual_network_read(fq_name = self._right_vn_fq_name)
            except NoIdError:
                print "Error: Right VN %s not found" % (self._right_vn_fq_name)
                return

        #create si
        print "Creating service instance %s" % (self._args.instance_name)
        project = self._vnc_lib.project_read(fq_name=self._proj_fq_name)
        try:
            si_obj = self._vnc_lib.service_instance_read(fq_name=self._si_fq_name)
            si_uuid = si_obj.uuid
            print "Service Instance - %s, already exists" % (self._args.instance_name)
        except NoIdError:
            si_obj = ServiceInstance(self._args.instance_name, parent_obj = project)
            si_uuid = self._vnc_lib.service_instance_create(si_obj)

        si_prop = ServiceInstanceType(left_virtual_network = self._args.left_vn, 
                                      management_virtual_network = self._args.mgmt_vn,
                                      right_virtual_network = self._args.right_vn)

        #set scale out
        scale_out = ServiceScaleOutType(max_instances = self._args.max_instances, 
                                        auto_scale = self._args.auto_scale)
        si_prop.set_scale_out(scale_out)

        si_obj.set_service_instance_properties(si_prop)
        st_obj = self._vnc_lib.service_template_read(id = st_obj.uuid)
        si_obj.set_service_template(st_obj)
        self._vnc_lib.service_instance_update(si_obj)

        if si_uuid is None:
            return "Error in creating Service Instance - %s" % (self._args.instance_name)
        else:
            print "Creating network policy for this service instance"
            confFile = "-c %s" % (self._conf_file)
            policyArgs = "%s %s %s %s %s %s %s %s %s %s" % (confFile, "add", "--svc_list", self._args.instance_name, "--vn_list", 
                                                     self._args.left_vn, self._args.right_vn, "--proj_name", self._args.proj_name, 
                                                     self._args.policy_name)
            print "%s" % servicePolicy.main(policyArgs)
            return "Successfully Created / Updated Service Instance - %s " % (self._args.instance_name)
        return si_uuid
    #end create_si

    def delete_si(self):
        try:
            print "Deleting Network policy attached to this instance"
            confFile = "-c %s" % (self._conf_file)
            policyArgs = "%s %s %s %s %s" % (confFile, "del", "--proj_name", self._args.proj_name, self._args.policy_name)
            print "Policy delete %s" % (policyArgs)
            print "%s" % servicePolicy.main(policyArgs)
            print "Deleting service instance %s" % (self._args.instance_name)
            self._vnc_lib.service_instance_delete(fq_name = self._si_fq_name)
            return "Successfully deleted Service instance %s" % (self._args.instance_name)
        except NoIdError:
            return "Not Found: Service Instance -%s does not exist" % (self._args.instance_name)
    #delete_si

#end class ServiceInstanceCmd

def main(args_str = None):
    si = ServiceInstanceCmd(args_str)
    return si._args.func()
#end main

def initialize(args_str = None):
    conf_parser = argparse.ArgumentParser(add_help = False)
        
    conf_parser.add_argument("-c", "--conf_file",
                                 help="Specify config file", metavar="FILE")
    args, remaining_argv = conf_parser.parse_known_args(args_str.split())
    
    config_file = {
            'operation'       : 'add',      
            'domain_name'     : 'default-domain',
            'proj_name'       : 'admin',
            'mgmt_vn'         : 'mgmt-vn',
            'left_vn'         : 'left-vn',
            'right_vn'        : 'right-vn',
            'max_instances'   : '1',
            'auto_scale'      : '--auto_scale',
            'instance_name'   : None,
            'template_name'   : None,
            'api_server_ip'   : '127.0.0.1',
            'api_server_port' : '8082',
            'policy_name'     : None,
        }  

    conf = "-c %s" % (args.conf_file)
    print "Input config file %s" % (args.conf_file)
    
    if args.conf_file:
            config = ConfigParser.SafeConfigParser()
            config.read([args.conf_file])
            config_file.update(dict(config.items("DEFAULTS")))
            
    for k, v in config_file.iteritems():
        if k is 'operation':
            oper = v
        else:
            if k is 'domain_name':
                    domain = v
            else:
                if k is 'proj_name':
                    proj = v
                else:
                    if k is 'mgmt_vn':
                        mgmt = v
                    else:
                        if k is 'left_vn':
                            lft = v
                        else:
                            if k is 'right_vn':
                                rgt = v
                            else:    
                                if k is 'max_instances':
                                    max = v
                                else:
                                    if k is 'auto_scale':
                                        scale = v
                                    else:
                                        if k is 'instance_name':
                                            inst = v
                                        else:
                                            if k is 'template_name':
                                                temp = v
                                            else:
                                                if k is 'policy_name':
                                                    policy = v
                                                else:
                                                    print "unknown config params not valid"
                                                
    print "Operation %s" % (oper)
    
    if oper == 'add':
        arguments = "%s %s %s %s %s %s %s %s %s %s %s" % (conf, oper, proj, mgmt, lft, rgt, max, scale, inst, temp, policy)
    else:
        arguments = "%s %s %s %s %s %s" % (conf, oper, proj, inst, temp, policy)
            
    print "Arguments are %s" % (arguments)
    status = main(arguments)
    return status        
#end initialize

if __name__ == "__main__":
   main() 
