#!/usr/bin/python

#-----------------------------------------------------
#Script for provisioning contrail Service Template
#Base version from contrail modified
#Author Sanju Abraham - sanjua@juniper.net
#-----------------------------------------------------

import os
import sys
import errno
import subprocess
import time
import argparse

sys.path.insert(0, os.path.realpath('/usr/lib/python2.7/site-packages'))

from django.core.management.base import BaseCommand, CommandError
from vnc_api.vnc_api import *
from vnc_api.common import exceptions as vnc_exceptions

from optparse import make_option

class Command(BaseCommand):
    option_list = BaseCommand.option_list + ()
    
class ServiceTemplateCmd(object):
    def __init__(self, args_str = None):
        self._args = None
        if not args_str:
            args_str = ' '.join(sys.argv[1:])
        self._parse_args(args_str)

        if self._args.svc_type == 'analyzer':
            self._if_list = [['management', False], ['left', self._args.svc_scaling]]
        else:
            self._if_list = [['management', False], ['left', self._args.svc_scaling], ['right', False]]

        self._st_fq_name = [self._args.domain_name, self._args.template_name]
        self._domain_fq_name = [self._args.domain_name]

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
            'image_name'      : 'vsrx',
            'svc_scaling'     : False,
            'svc_type'        : 'firewall',
            'api_server_ip'   : '127.0.0.1',
            'api_server_port' : '8082',
        }

        if args.conf_file:
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
        create_parser.add_argument("template_name", help = "service template name")
        create_parser.add_argument("--svc_type", help = "firewall or analyzer [default: firewall]", 
                                   choices=['firewall', 'analyzer'])
        create_parser.add_argument("--image_name", help = "glance image name [default: vsrx]")
        create_parser.add_argument("--svc_scaling", action = "store_true", default = False,
                                   help = "enable service scaling [default: False]")
        create_parser.set_defaults(func = self.create_st)

        delete_parser = subparsers.add_parser('del')
        delete_parser.add_argument("template_name", help = "service template name")
        delete_parser.set_defaults(func = self.delete_st)

        self._args = parser.parse_args(remaining_argv)
    #end _parse_args

    #create service template
    def create_st(self):
        print "Creating service template %s" % (self._args.template_name)
        try:
            st_obj = self._vnc_lib.service_template_read(fq_name=self._st_fq_name)
            st_uuid = st_obj.uuid
            return "Service Template - %s, already exists" % (self._args.template_name)
        except NoIdError:
            domain = self._vnc_lib.domain_read(fq_name=self._domain_fq_name)
            st_obj = ServiceTemplate(name=self._args.template_name, domain_obj=domain)
            st_uuid = self._vnc_lib.service_template_create(st_obj)

        svc_properties = ServiceTemplateType()
        svc_properties.set_image_name(self._args.image_name)
        svc_properties.set_service_scaling(True)
        svc_properties.set_service_type(self._args.svc_type)

        #set interface list
        for itf in self._if_list:
            if_type = ServiceTemplateInterfaceType(shared_ip=itf[1])
            if_type.set_service_interface_type(itf[0])
            svc_properties.add_interface_type(if_type)

        st_obj.set_service_template_properties(svc_properties)
        self._vnc_lib.service_template_update(st_obj)

        if st_uuid is None:
            return "Error in creating Service Template - %s" % (self._args.template_name)
        else:
            return "Successfuly Created Service Template - %s" % (self._args.template_name)
             
    #create_st

    def delete_st(self):
        try:
            print "Deleting service template %s" % (self._args.template_name)
            self._vnc_lib.service_template_delete(fq_name = self._st_fq_name)
            return "Successfuly deleted Service template %s" % (self._args.template_name)
        except NoIdError:
            return "Service template %s not found" % (self._args.template_name)
            #return
    #_delete_st

#end class ServiceTemplateCmd

def main(args_str = None):
    st = ServiceTemplateCmd(args_str)
    return st._args.func()
#end main

def initialize(args_str = None):
    conf_parser = argparse.ArgumentParser(add_help = False)
        
    conf_parser.add_argument("-c", "--conf_file",
                                 help="Specify config file", metavar="FILE")
    args, remaining_argv = conf_parser.parse_known_args(args_str.split())
    
    config_file = {
            'operation'       : 'add',      
            'domain_name'     : 'default-domain',
            'template_name'   : None,
            'image_name'      : 'vsrx',
            'svc_scaling'     : False,
            'svc_type'        : 'firewall',
            'api_server_ip'   : '127.0.0.1',
            'api_server_port' : '8082',
        }

    conf = "-c %s" % (args.conf_file)
    
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
                if k is 'svc_type':
                    svcType = v
                else:
                    if k is 'image_name':
                        img = v
                    else:
                        if k is 'svc_scaling':
                            scale = v
                        else:    
                            if k is 'template_name':
                                template = v
                            else:
                                if k is 'api_server_ip':
                                    apiServer = v
                                else:
                                    if k is 'api_server_port':
                                        apiServPort = v
                                    else:
                                        print "unknown config params not valid"
                
    arguments = "%s %s %s %s %s %s " % (conf, oper, svcType, img, scale, template)
    status = main(arguments)
    return status        
#end initialize

if __name__ == "__main__":
    main() 
