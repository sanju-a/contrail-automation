#!/usr/bin/python

import os
import sys
import ConfigParser
import httplib
import json
import base64

class spaceSecDirApi(object):


    def __init__(self, args_str = None):
        self._args = None
        if not args_str:
            args_str = ' '.join(sys.argv[1:])
        self._read_config(args_str)

    #end __init__

    def _read_config(self, args_str):

        global_config = {
            'space_user'         : 'super',
            'space_pass'         : 'juniper123',
            'space_server_ip'    : '127.0.0.1',
            'space_server_port'  : '8080',
        }

        config = ConfigParser.SafeConfigParser()
        config.read('space.conf')
        global_config.update(dict(config.items("DEFAULTS")))

        #print (global_config)
        self.config = global_config


    #end _read_config

    def create_queue(self, queueName):
        connection = httplib.HTTPConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.connect()
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        body = '<queue name=" + queueName + "><durable>false</durable></queue>'

        connection.request('POST', '/api/hornet-q/queues', body,
            {
               "Authorization": "basic " + authHeader,
               "Content-Type": "application/hornetq.jms.queue+xml"
            })
        response = connection.getresponse()
        #print response.status
        #print response.reason
        result = response.read()
        #print result

    #end create_queue


    def device_discovery(self, ipAddr):

        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')

        connection = httplib.HTTPConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.connect()

        body = "<discover-devices>"
        body += " <ipAddressDiscoveryTarget> "
        body += " <ipAddress>"+ipAddr+"</ipAddress>"
        body += " </ipAddressDiscoveryTarget>"
        body += " <manageDiscoveredSystemsFlag>true</manageDiscoveredSystemsFlag>"
        body += " <usePing>true</usePing>"
        body += " <useSnmp>true</useSnmp>"
        body += " <snmpV1Setting> <communityName>testCommunityName</communityName> </snmpV1Setting>"
        body += " <sshCredential> <userName>user</userName> <password>password</password> </sshCredential>"
        body += " </discover-devices>"

        queueName= 'http://127.0.0.1:8080/api/hornet-q/queues/jms.queue.MyQueue2'
        url = '/api/space/device-management/discover-devices?queue=' + queueName
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
        #print result

    #end device_discovery


    def list_devices(self):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')

        connection = httplib.HTTPConnection(self.config['space_server_ip'], self.config['space_server_port'])
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

    def find_device(self, ipAddr):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        url = '/api/juniper/sd/device-management/devices?filter=(device-ip%20eq%20\'' + ipAddr + '\')'

        connection = httplib.HTTPConnection(self.config['space_server_ip'], self.config['space_server_port'])
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

    def create_policy(self, ipAddr):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        body = '{"firewall-policy": {'
        body += '"policy-type": "DEVICE",'
        body += '"description": "Device policy created by Contrail",'
        body += '"name": "DP-'+ipAddr+'",'
        body += '"precedence": 0,'
        body += '"priority": 0,'
        body += '"ips-mode": "NONE",'
        body += '"manage-global-policy": true,'
        body += '"manage-zone-policy": false,'
        body += '}}'

        connection = httplib.HTTPConnection(self.config['space_server_ip'], self.config['space_server_port'])
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


    def find_policy(self, ipAddr):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        url = '/api/juniper/sd/fwpolicy-management/firewall-policies?filter=(name%20eq%20\'DP-' + ipAddr + '\')'

        connection = httplib.HTTPConnection(self.config['space_server_ip'], self.config['space_server_port'])
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
        url = '/api/juniper/sd/fwpolicy-management/firewall-policies/'+ id + '/lock'

        connection = httplib.HTTPConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.request('POST', url,
               '',
             {
               "Authorization": "basic " + authHeader,
               "Content-Type": "application/vnd.juniper.sd.lock-management.lock+jsonl;version=1;charset=UTF-8"
             })
        response = connection.getresponse()
        print response.status
        print response.reason
        #print response.getheaders()
        sessionid = response.getheader("set-cookie")
        #print sessionid
        result = response.read()
        #print result
        return sessionid
    #end lock_policy

    def unlock_policy(self, id):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')
        url = '/api/juniper/sd/fwpolicy-management/firewall-policies/'+ id + '/unlock'

        connection = httplib.HTTPConnection(self.config['space_server_ip'], self.config['space_server_port'])
        connection.request('POST', url,
               '',
             {
               "Authorization": "basic " + authHeader,
               "Content-Type": "application/vnd.juniper.sd.lock-management.lock+jsonl;version=1;charset=UTF-8"
             })
        response = connection.getresponse()
        print response.status
        print response.reason
        #print response.getheaders()
        result = response.read()
        #print result
        return result
    #end unlock_policy

    def add_rule(self, sessionid, policyId, ruleGroupId, service):
        authHeader = base64.encodestring('%s:%s' % (self.config['space_user'], self.config['space_pass'])).replace('\n', '')

        connection = httplib.HTTPConnection(self.config['space_server_ip'], self.config['space_server_port'])
        body = '{"modify-rules": {'
        body += '"name": "Rule101",'
        body += '"edit-verstion": "1",'
        body += '"policy-id": "' + policyId + '",'
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
        body += '"name": "' + service + '"'
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
        print response.status
        print response.reason
        result = response.read()
        print result
        print json.dumps(result, sort_keys=True, indent=2)



    #end add_rule

#end class spaceSecDirApi

def main(args_str = None):
    spApi = spaceSecDirApi(args_str)

    spApi.create_queue('MyQueue2')
    spApi.device_discovery('192.168.1.1')
    spApi.list_devices()

    myDevices = spApi.find_device('10.155.67.16')
    myDevice = myDevices['devices']['device']
    #print json.dumps(myDevice, sort_keys=True, indent=2)

    myDeviceId = myDevice['id']
    myDeviceMoid = myDevice['cems-moid']
    print myDeviceId

    spApi.create_policy('10.155.67.16')
    myPolicies = spApi.find_policy('10.155.67.16')
    myPolicy = myPolicies['firewall-policies']['firewall-policy']
    print json.dumps(myPolicy,  sort_keys=True, indent=2)
    #myPolicyId = myPolicy['id']
    myPolicyId = '1867776'
    print myPolicyId

    ruleGroupId = "1"
    session = spApi.lock_policy(myPolicyId)
    print session
    spApi.add_rule(session, myPolicyId, ruleGroupId, "http")
    spApi.unlock_policy(myPolicyId)


#end main

if __name__ == "__main__":
    main() 


