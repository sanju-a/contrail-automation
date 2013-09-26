#!/usr/bin/python

import os
import sys
import ConfigParser
import httplib
import json
import base64
import argparse

sys.path.insert(0, os.path.realpath('/usr/lib/python2.7/site-packages'))

from django.core.management.base import BaseCommand, CommandError

from optparse import make_option

class Command(BaseCommand):
    option_list = BaseCommand.option_list + ()

class spaceSecDirApi(object):

    def __init__(self, args_str = None):
        self._args = None
        if not args_str:
            args_str = ' '.join(sys.argv[1:])
        self._read_config(args_str)

    #end __init__

    def _read_config(self, args_str):
        conf_parser = argparse.ArgumentParser(add_help = False)
        conf_parser.add_argument("-c", "--conf_file",
                                help="Specify config file", metavar="FILE")
        args, remaining_argv = conf_parser.parse_known_args(args_str.split())
        
        global_config = {
            'space_user'         : 'super',
            'space_pass'         : 'juniper123',
            'space_server_ip'    : '127.0.0.1',
            'space_server_port'  : '8080',
            'space_q'            : 'MyQueue2',
            'device'             : '127.0.0.1',
            'cliuser'            : 'user',
            'clipass'            : 'password',
        }

        config = ConfigParser.SafeConfigParser()
        if args.conf_file:
            self._conf_file = args.conf_file
            config.read([args.conf_file])
            global_config.update(dict(config.items("DEFAULTS")))
            
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

        parser.set_defaults(**global_config)
        subparsers = parser.add_subparsers()

        create_parser = subparsers.add_parser('add')
        
        create_parser.add_argument("protocol", help = "protocol name for policy")
        
        self._args = parser.parse_args(remaining_argv)

        #print (global_config)
        self.config = global_config

    
    #end _read_config

    def create_queue(self):
        connection = httplib.HTTPSConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.connect()
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        body = "<queue name="+'"'+self.config['space_q']+'"'+"><durable>false</durable></queue>"
        connection.request('POST', '/api/hornet-q/queues', body,
            {
               "Authorization": "basic " + authHeader,
               "Content-Type": "application/hornetq.jms.queue+xml"
            })
        response = connection.getresponse()
        print response.status
        print response.reason
        result = response.read()
        print result

    #end create_queue


    def device_discovery(self):

        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')

        connection = httplib.HTTPSConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.connect()

        body = "<discover-devices>"
        body += " <ipAddressDiscoveryTarget> "
        body += " <ipAddress>"+self.config['device']+"</ipAddress>"
        body += " </ipAddressDiscoveryTarget>"
        body += " <manageDiscoveredSystemsFlag>true</manageDiscoveredSystemsFlag>"
        body += " <usePing>true</usePing>"
        body += " <useSnmp>false</useSnmp>"
        body += " <snmpV1Setting> <communityName>testCommunityName</communityName> </snmpV1Setting>"
        body += " <sshCredential> <userName>"+self.config['cliuser']+"</userName> <password>"+self.config['clipass'].replace('\n', '')+"</password> </sshCredential>"
        body += " </discover-devices>"

        queueUrl = "https://"+self.config['space_server_ip']+"/api/hornet-q/queues/jms.queue."+self.config['space_q']
        url = '/api/space/device-management/discover-devices?queue=' + queueUrl
        connection.request('POST',
               url,
               body,
             {
               "Authorization": "basic " + authHeader,
               "Content-Type": "application/vnd.net.juniper.space.device-management.discover-devices+xml;version=2;charset=UTF-8"
             })
        response = connection.getresponse()
        #print response.status
        #print response.reason
        result = response.read()
        print result

    #end device_discovery


    def list_devices(self):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')

        connection = httplib.HTTPSConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.connect()
        connection.request('GET', '/api/juniper/sd/device-management/devices',
               '',
             {
               "Authorization": "basic " + authHeader,
               "Accept": "application/vnd.juniper.sd.device-management.devices+json;version=1"
             })
        result = connection.getresponse().read()
        #print result
        jresult = json.loads(result)
        #print json.dumps(jresult, sort_keys=True, indent=2)

        return jresult

    #end list_devices

    def find_device(self):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        url = '/api/juniper/sd/device-management/devices?filter=(device-ip%20eq%20\'' + self.config['device'] + '\')'

        connection = httplib.HTTPSConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.connect()
        connection.request('GET', url,
               '',
             {
               "Authorization": "basic " + authHeader,
               "Accept": "application/vnd.juniper.sd.device-management.devices+json;version=1"
             })
        result = connection.getresponse().read()
        #print result
        jresult = json.loads(result)
        #print json.dumps(jresult, sort_keys=True, indent=2)

        return jresult

    #end find_device

    def create_policy(self):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        body = '{"firewall-policy": {'
        body += '"policy-type": "DEVICE",'
        body += '"description": "Device policy created by Contrail",'
        body += '"name": "DP-'+self.config['device']+'",'
        body += '"precedence": 0,'
        body += '"priority": 0,'
        body += '"ips-mode": "NONE",'
        body += '"manage-global-policy": true,'
        body += '"manage-zone-policy": false,'
        body += '}}'

        connection = httplib.HTTPSConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.connect()
        connection.request('POST', '/api/juniper/sd/fwpolicy-management/firewall-policies',
               body,
             {
               "Authorization": "basic " + authHeader,
               "Content-Type": "application/vnd.juniper.sd.fwpolicy-management.firewall-policy+json;version=1;charset=UTF-8",
               "Accept": "application/vnd.juniper.sd.fwpolicy-management.firewall-policy+json;version=1"
             })
        response = connection.getresponse()
        #print response.status
        #print response.reason
        result = response.read()

        #print json.dumps(result, sort_keys=True, indent=2)
    #end create_policy


    def find_policy(self):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        url = '/api/juniper/sd/fwpolicy-management/firewall-policies?filter=(name%20eq%20\'DP-' + self.config['device'] + '\')'

        connection = httplib.HTTPSConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.request('GET', url,
               '',
             {
               "Authorization": "basic " + authHeader,
               "Accept": "application/vnd.juniper.sd.fwpolicy-management.firewall-policies+json;version=1"
             })
        result = connection.getresponse().read()
        #print result
        jresult = json.loads(result)
        #print json.dumps(jresult, sort_keys=True, indent=2)
        return jresult


    #end find_policy

    def lock_policy(self, id):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        url = '/api/juniper/sd/fwpolicy-management/firewall-policies/'+ `id` + '/lock'

        connection = httplib.HTTPSConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.request('POST', url,
               '',
             {
               "Authorization": "basic " + authHeader,
               "Content-Type": "application/vnd.juniper.sd.lock-management.lock+jsonl;version=1;charset=UTF-8"
             })
        response = connection.getresponse()
        #print response.status
        #print response.reason
        #print response.getheaders()
        sessionid = response.getheader("set-cookie")
        #print sessionid
        result = response.read()
        #print result
        return sessionid
    #end lock_policy

    def unlock_policy(self, id):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        url = '/api/juniper/sd/fwpolicy-management/firewall-policies/'+ `id` + '/unlock'

        connection = httplib.HTTPSConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.request('POST', url,
               '',
             {
               "Authorization": "basic " + authHeader,
               "Content-Type": "application/vnd.juniper.sd.lock-management.lock+jsonl;version=1;charset=UTF-8"
             })
        response = connection.getresponse()
        #print response.status
        #print response.reason
        #print response.getheaders()
        result = response.read()
        #print result
        return result
    #end unlock_policy

    def add_rule(self, sessionid, policyId, ruleGroupId):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')

        connection = httplib.HTTPSConnection(self.config['space_server_ip'], self.config['space_server_port'])
        body = '{"modify-rules": {'
        body += '"name": "Rule101",'
        body += '"edit-verstion": "1",'
        body += '"policy-id": "' + `policyId` + '",'
        body += '"added-rules": {'
        body += '"added-rule": {'
        body += '"enabled": true,'
        body += '"rule-order": 0,'
        body += '"rule-type": "RULE",'
        body += '"rule-group-id": "' + ruleGroupId + '",'
        body += '"ips-enabled": false,'
        body += '"ips-mode": "NONE",'
        body += '"vpn-tunnel-refs": "",'
        body += '"action": "PERMIT",'
        body += '"services": {'
        body += '"service": {'
        body += '"name": "' + self._args.protocol + '"'
        body += '}},'
        body += '"destination-addresses": {'
        body += '"destination-address": {'
        body += '"name": "Any",'
        body += '"address-type": "ANY"'
        body += '}},'
        body += '"source-addresses": {'
        body += '"source-address": {'
        body += '"name": "Any",'
        body += '"address-type": "ANY"'
        body += '}}'
        body += '}}}}'

        print body
        connection.request('POST', '/api/juniper/sd/fwpolicy-management/modify-rules',
               body,
             {
               "Authorization": "basic " + authHeader,
               "cookie": sessionid,
               "Content-Type": "application/vnd.juniper.sd.fwpolicy-management.modify-rules+json;version=1;charset=UTF-8"
             })
        response = connection.getresponse()
        #print response.status
        #print response.reason
        result = response.read()
        #print result
        print json.dumps(result, sort_keys=True, indent=2)



    #end add_rule

#end class spaceSecDirApi

def main(args_str = None):
    spApi = spaceSecDirApi(args_str)

    spApi.create_queue()
    spApi.device_discovery()
    spApi.list_devices()

    myDevices = spApi.find_device()
    myDevice = myDevices['devices']['device']
    print json.dumps(myDevice, sort_keys=True, indent=2)

    myDeviceId = myDevice['id']
    myDeviceMoid = myDevice['cems-moid']
    print myDeviceId

    spApi.create_policy()
    myPolicies = spApi.find_policy()
    myPolicy = myPolicies['firewall-policies']['firewall-policy']
    print json.dumps(myPolicy,  sort_keys=True, indent=2)
    myPolicyId = myPolicy[2]
    print myPolicyId['id']

    ruleGroupId = "1"
    session = spApi.lock_policy(myPolicyId['id'])
    print session
    spApi.add_rule(session, myPolicyId['id'], ruleGroupId)
    spApi.unlock_policy(myPolicyId['id'])


#end main

def initialize(args_str = None):
    conf_parser = argparse.ArgumentParser(add_help = False)
    conf_parser.add_argument("-c", "--conf_file",
                                 help="Specify config file", metavar="FILE")
    conf_parser.add_argument("--operation",help="Specify operation", metavar="STRING")
    conf_parser.add_argument("--protocol",help="Specify policy protocol", metavar="STRING")
    args, remaining_argv = conf_parser.parse_known_args(args_str.split())
    
    config_file = {
            'space_user'         : 'super',
            'space_pass'         : 'juniper123',
            'space_server_ip'    : '127.0.0.1',
            'space_server_port'  : '8080',
            'space_q'            : 'MyQueue2',
            'device'             : '127.0.0.1',
            'cliuser'            : 'user',
            'clipass'            : 'password',
        }  

    if args.conf_file:
        config = ConfigParser.SafeConfigParser()
        config.read([args.conf_file])
        config_file.update(dict(config.items("DEFAULTS")))
    
    conf = "-c %s" % (args.conf_file)
        
    oper = "%s" % (args.operation)
    
    prot = "%s" % (args.protocol)
    
    arguments = "%s %s %s" % (conf, oper, prot)
    
    print "COMMAND ARGS %s" %(arguments)
    status = main(arguments)
    return status        
#end initialize

if __name__ == "__main__":
    main() 

