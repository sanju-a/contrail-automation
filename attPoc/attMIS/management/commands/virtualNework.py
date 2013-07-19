#!/usr/bin/python

#-----------------------------------------------------
#Script for provisioning contrail Virtual Network
#Author Sanju Abraham - sanjua@juniper.net
#-----------------------------------------------------

import os
import sys
import errno
import subprocess
import time
import argparse

sys.path.insert(0, os.path.realpath('/usr/lib/python2.7/site-packages'))

from vnc_api.vnc_api import *
from vnc_api.common import exceptions as vnc_exceptions

class VirtualNetworkCmd(object):
    def __init__(self, args_str = None):
        self._args = None
        if not args_str:
            args_str = ' '.join(sys.argv[1:])
        self._parse_args(args_str)

        self._proj_fq_name = [self._args.domain_name, self._args.proj_name]
        self._vn_fq_name = [self._args.domain_name, self._args.proj_name, self._args.vn_name]

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
            'proj_name'       : 'admin',
            'vn_name'         : 'mgmt-vn',
            'vn_ip_prefix'    : '10.1.1.0',
            'vn_prefix_sz'    : '29',
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
        create_parser.add_argument("--vn_type", help = "management(mgmt), left  or right [default: mgmt]",
                                   choices=['mgmt', 'left', 'right'])
        create_parser.add_argument("proj_name", help = "project name")
        create_parser.add_argument("vn_name", help = "virtual network name")
        create_parser.add_argument("vn_ip_prefix", help = "virtual network ip prefix")
        create_parser.add_argument("vn_prefix_sz", metavar='N', type=int, 
                                  help = "virtual network name ip prefix size")
        create_parser.set_defaults(func = self.create_vn)

        delete_parser = subparsers.add_parser('del')
        delete_parser.add_argument("proj_name", help = "project name")
        delete_parser.add_argument("vn_name", help = "virtual network name")
        delete_parser.set_defaults(func = self.delete_vn)

        self._args = parser.parse_args(remaining_argv)
    #end _parse_args

    #create virtual network
    def create_vn(self):
        print "Creating virtual network %s" % (self._args.vn_name)
        try:
        	proj_obj = self._vnc_lib.project_read(fq_name=self._proj_fq_name)
                vn_obj = self._vnc_lib.virtual_network_read(fq_name=self._vn_fq_name)
                vn_uuid = vn_obj.uuid
        except NoIdError:
        	vn_obj = VirtualNetwork(name=self._args.vn_name, parent_obj=proj_obj)
        	vn_uuid = self._vnc_lib.virtual_network_create(vn_obj)

        vn_subnetType = SubnetType()
        vn_subnetType.set_ip_prefix(self._args.vn_ip_prefix)
        vn_subnetType.set_ip_prefix_len(self._args.vn_prefix_sz)

        vn_ipamSubnetType = IpamSubnetType(subnet=vn_subnetType)
	vn_subnetsType = VnSubnetsType([vn_ipamSubnetType])

        vn_networkIpam = NetworkIpam()

        vn_obj.add_network_ipam(vn_networkIpam,vn_subnetsType)

        try:
        	vn_uuid = self._vnc_lib.virtual_network_update(vn_obj)
        except RefsExistError:
                print "Virtual Network with %s already exists" % (self._args.vn_name)
        
        return vn_uuid
    #create_vn

    def delete_vn(self):
        try:
                vn_obj = self._vnc_lib.virtual_network_read(fq_name=self._vn_fq_name)
       		self._vnc_lib.virtual_network_delete(id=vn_obj.uuid)
        	print "Deleted Virtual Network %s" % (self._args.vn_name)
        except NoIdError:
                print "Virtual Network %s does not exist" % (self._args.vn_name)

        return
    #_delete_vn

#end class VirtualNetworkCmd

def main(args_str = None):
    st = VirtualNetworkCmd(args_str)
    st._args.func()
#end main

if __name__ == "__main__":
    main() 
