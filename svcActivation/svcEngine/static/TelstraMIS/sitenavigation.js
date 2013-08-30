/////////////////////////////////////////////////////////////////////////////
// Function : NavNode (constructor)
// Comments :
/////////////////////////////////////////////////////////////////////////////
function NavNode(id, label, href, parent)
{
	this.m_parent = null;
	this.m_level = 0;

	if (parent)
	{
		this.m_parent = parent;
		this.m_level = parent.m_level+1;
	}

	this.m_id = id;

	// assume that m_label will most often be used directly as HTML
	this.m_rawlabel = label;

	label = label.replace(/&/g, '&amp;');
	label = label.replace(/</g, '&lt;');
	label = label.replace(/>/g, '&gt;');
	label = label.replace(/"/g, '&quot;');

	this.m_label = label;

	this.m_href = href;
	this.m_subNodes = new Array();

	var argValues = NavNode.arguments;
	var argCount = NavNode.arguments.length;

	for (i = 4 ; i < argCount ; i++)
	{
		var eqPos = argValues[i].indexOf("==");
		var attrName = argValues[i].substring(0,eqPos);
		var attrValue = argValues[i].substring(eqPos+2);

		eval("this.cp_" + attrName + " = '" + attrValue + "';");
	}

	NavNode.prototype.addNode = addNode;
	NavNode.prototype.isSelected = isSelected;
}

/////////////////////////////////////////////////////////////////////////////
// Function : addNode
// Comments :
/////////////////////////////////////////////////////////////////////////////
function addNode(id, label, href)
{
	var newIndex = this.m_subNodes.length;
	var newNode = new NavNode(id, label, href, this);

	var argValues = addNode.arguments;
	var argCount = addNode.arguments.length;

	for (i = 3 ; i < argCount ; i++)
	{
		var eqPos = argValues[i].indexOf("==");
		var attrName = argValues[i].substring(0,eqPos);
		var attrValue = argValues[i].substring(eqPos+2);

		eval("newNode.cp_" + attrName + " = '" + attrValue + "';");
	}

	this.m_subNodes[newIndex] = newNode;
	return newNode;
}

/////////////////////////////////////////////////////////////////////////////
// Function : isSelected
// Comments :
/////////////////////////////////////////////////////////////////////////////
function isSelected()
{
    var pos = window.location.href.lastIndexOf("/");
    var docname = window.location.href.substring(pos+1, window.location.href.length);

    pos = this.m_href.lastIndexOf("/");
    var myname = this.m_href.substring(pos+1, this.m_href.length);

    if (docname == myname)
		return true;
	else
		return false;
}

/////////////////////////////////////////////////////////////////////////////
// Function : customSectionPropertyExists
// Comments :
/////////////////////////////////////////////////////////////////////////////
function customSectionPropertyExists(csp)
{
	return (typeof csp != _U && csp != null);
}

/////////////////////////////////////////////////////////////////////////////
// Function : getCustomSectionProperty
// Comments :
/////////////////////////////////////////////////////////////////////////////
function getCustomSectionProperty(csp)
{
	if (customSectionPropertyExists(csp))
	{
		return csp;
	}
	else
	{
		return "";
	}
}

/////////////////////////////////////////////////////////////////////////////

var g_navNode_Root = new NavNode('ss-home-be','Home',ssUrlPrefix + 'index.htm',null);
g_navNode_1=g_navNode_Root.addNode('ss-be-products-services','Business Products',ssUrlPrefix + 'business-products/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_0=g_navNode_1.addNode('1145','Cloud Services',ssUrlPrefix + 'business-products/cloud-services/index.htm');
g_navNode_1_0_0=g_navNode_1_0.addNode('1150','Microsoft Office 365',ssUrlPrefix + 'business-products/cloud-services/microsoft-office-365/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_0_0_0=g_navNode_1_0_0.addNode('1151','Microsoft Office 365 Bundle',ssUrlPrefix + 'business-products/cloud-services/microsoft-office-365/microsodt-office-365-bundle/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_0_1=g_navNode_1_0.addNode('1146','Management Applications',ssUrlPrefix + 'business-products/cloud-services/management-applications/index.htm');
g_navNode_1_0_1_1=g_navNode_1_0_1.addNode('ss-be-microsoft-dynamics-crm','CRM',ssUrlPrefix + 'business-products/cloud-services/management-applications/crm/index.htm');
g_navNode_1_0_1_2=g_navNode_1_0_1.addNode('1148','Finance',ssUrlPrefix + 'business-products/cloud-services/management-applications/finance/index.htm');
g_navNode_1_0_1_3=g_navNode_1_0_1.addNode('1149','HR',ssUrlPrefix + 'business-products/cloud-services/management-applications/hr/index.htm');
g_navNode_1_0_2=g_navNode_1_0.addNode('1152','Security Applications',ssUrlPrefix + 'business-products/cloud-services/security/index.htm');
g_navNode_1_0_2_0=g_navNode_1_0_2.addNode('1153','Endpoint',ssUrlPrefix + 'business-products/cloud-services/security/endpoint/index.htm');
g_navNode_1_0_2_1=g_navNode_1_0_2.addNode('1154','Network',ssUrlPrefix + 'business-products/cloud-services/security/network/index.htm');
g_navNode_1_0_3=g_navNode_1_0.addNode('1160','Servers',ssUrlPrefix + 'business-products/cloud-services/servers/index.htm');
g_navNode_1_0_4=g_navNode_1_0.addNode('1155','Backup and Archiving',ssUrlPrefix + 'business-products/cloud-services/backup-and-archiving/index.htm');
g_navNode_1_0_4_0=g_navNode_1_0_4.addNode('1156','Email Archiving',ssUrlPrefix + 'business-products/cloud-services/backup-and-archiving/email-archiving/index.htm');
g_navNode_1_0_4_1=g_navNode_1_0_4.addNode('1157','PC',ssUrlPrefix + 'business-products/cloud-services/backup-and-archiving/pc/index.htm');
g_navNode_1_0_4_2=g_navNode_1_0_4.addNode('1158','Server',ssUrlPrefix + 'business-products/cloud-services/backup-and-archiving/server/index.htm');
g_navNode_1_0_5=g_navNode_1_0.addNode('1159','Consulting',ssUrlPrefix + 'business-products/cloud-services/consulting/index.htm');
g_navNode_1_1=g_navNode_1.addNode('1140','Websites and Domains',ssUrlPrefix + 'business-products/websites-and-domains/index.htm');
g_navNode_1_1_0=g_navNode_1_1.addNode('1143','Website Design',ssUrlPrefix + 'business-products/websites-and-domains/website-design/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_1_0_0=g_navNode_1_1_0.addNode('1144','Design it for me',ssUrlPrefix + 'business-products/websites-and-domains/website-design/design-it-for-me/index.htm');
g_navNode_1_1_0_1=g_navNode_1_1_0.addNode('1180','Design it yourself',ssUrlPrefix + 'business-products/websites-and-domains/website-design/design-it-yourself/index.htm');
g_navNode_1_1_1=g_navNode_1_1.addNode('1142','Website Hosting',ssUrlPrefix + 'business-products/websites-and-domains/website-hosting/index.htm');
g_navNode_1_1_2=g_navNode_1_1.addNode('1141','Domain Names',ssUrlPrefix + 'business-products/websites-and-domains/domain-names/index.htm');
g_navNode_1_2=g_navNode_1.addNode('ss-be-internet','Internet \x26 Data',ssUrlPrefix + 'business-products/internet-data/index.htm');
g_navNode_1_2_0=g_navNode_1_2.addNode('ss-be-internet-plans','Telstra Mobile Broadband',ssUrlPrefix + 'business-products/internet-data/telstra-mobile-broadband/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_2_0_0=g_navNode_1_2_0.addNode('ss-be-internet-mob-broadband','Plans and Pricing',ssUrlPrefix + 'business-products/internet-data/telstra-mobile-broadband/plans-and-pricing/index.htm');
g_navNode_1_2_1=g_navNode_1_2.addNode('ss-be-internet-devices','Devices',ssUrlPrefix + 'business-products/internet-data/devices/index.htm');
g_navNode_1_2_1_0=g_navNode_1_2_1.addNode('ss-be-internet-data-accesories','Accessories',ssUrlPrefix + 'business-products/internet-data/devices/accessories/index.htm');
g_navNode_1_2_1_1=g_navNode_1_2_1.addNode('ss-be-internet-tablets','Internet Tablets',ssUrlPrefix + 'business-products/internet-data/devices/internet-tablets/index.htm');
g_navNode_1_2_1_1_1=g_navNode_1_2_1_1.addNode('ss-be-samsung-note-tablet','Samsung Note Tablet',ssUrlPrefix + 'business-products/internet-data/devices/internet-tablets/samsung-note-tablet/index.htm');
g_navNode_1_2_1_1_2=g_navNode_1_2_1_1.addNode('932','Toshiba z10t',ssUrlPrefix + 'business-products/internet-data/devices/internet-tablets/toshiba-z10t/index.htm','contributorOnly==FALSE');
g_navNode_1_2_1_2=g_navNode_1_2_1.addNode('445','iPad',ssUrlPrefix + 'business-products/internet-data/devices/ipad/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_2_1_3=g_navNode_1_2_1.addNode('ss-be-internet-mobile-wifi','Mobile Wi-Fi',ssUrlPrefix + 'business-products/internet-data/devices/mobile-wi-fi/index.htm');
g_navNode_1_2_1_4=g_navNode_1_2_1.addNode('ss-be-internet-routers','Network Gateways',ssUrlPrefix + 'business-products/internet-data/devices/network-gateways/index.htm');
g_navNode_1_2_1_5=g_navNode_1_2_1.addNode('ss-be-internet-4g','USB 4G',ssUrlPrefix + 'business-products/internet-data/devices/usb-4g/index.htm');
g_navNode_1_2_1_6=g_navNode_1_2_1.addNode('ss-be-internet-gateways','Wireless Gateways',ssUrlPrefix + 'business-products/internet-data/devices/wireless-gateways/index.htm');
g_navNode_1_2_1_7=g_navNode_1_2_1.addNode('ss-be-telstra-outdoor-gateway','Telstra Outdoor Gateway',ssUrlPrefix + 'business-products/internet-data/devices/telstra-outdoor-gateway/index.htm');
g_navNode_1_2_2=g_navNode_1_2.addNode('ss-be-internet-dsl','Ethernet \x26 DSL',ssUrlPrefix + 'business-products/internet-data/ethernet-dsl/index.htm');
g_navNode_1_2_2_0=g_navNode_1_2_2.addNode('ss-be-bundles-business-adsl','Business Broadband ADSL',ssUrlPrefix + 'business-products/internet-data/ethernet-dsl/business-broadband-adsl/index.htm');
g_navNode_1_2_2_1=g_navNode_1_2_2.addNode('ss-be-bundles-business-eth','Business Broadband Ethernet',ssUrlPrefix + 'business-products/internet-data/ethernet-dsl/business-broadband-ethernet/index.htm');
g_navNode_1_2_2_2=g_navNode_1_2_2.addNode('ss-be-internet-dsl-atm','Ethernet ATM',ssUrlPrefix + 'business-products/internet-data/ethernet-dsl/ethernet-atm/index.htm');
g_navNode_1_2_2_3=g_navNode_1_2_2.addNode('ss-be-internet-dsl-line','Ethernet Line',ssUrlPrefix + 'business-products/internet-data/ethernet-dsl/ethernet-line/index.htm');
g_navNode_1_2_2_4=g_navNode_1_2_2.addNode('ss-be-internet-dsl-lite','Ethernet Lite',ssUrlPrefix + 'business-products/internet-data/ethernet-dsl/ethernet-lite/index.htm');
g_navNode_1_2_2_5=g_navNode_1_2_2.addNode('ss-be-internet-dsl-man','Ethernet MAN',ssUrlPrefix + 'business-products/internet-data/ethernet-dsl/ethernet-man/index.htm');
g_navNode_1_2_3=g_navNode_1_2.addNode('ss-be-fire-line-service','Fire Line Service',ssUrlPrefix + 'business-products/internet-data/fire-line-service/index.htm','contributorOnly==FALSE');
g_navNode_1_2_4=g_navNode_1_2.addNode('ss-be-internet-nbn','National Broadband Network',ssUrlPrefix + 'business-products/internet-data/national-broadband-network/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_2_5=g_navNode_1_2.addNode('ss-be-internet-bus-solutions','Business Solutions',ssUrlPrefix + 'business-products/internet-data/business-solutions/index.htm');
g_navNode_1_2_5_0=g_navNode_1_2_5.addNode('ss-be-bus-sol-accounting','Accounting',ssUrlPrefix + 'business-products/internet-data/business-solutions/accounting/index.htm');
g_navNode_1_2_5_1=g_navNode_1_2_5.addNode('ss-be-bus-sol-in-home-nursing','Mobile Health Care',ssUrlPrefix + 'business-products/internet-data/business-solutions/in-home-nursing/index.htm');
g_navNode_1_2_5_2=g_navNode_1_2_5.addNode('ss-be-bus-sol-tradesmen','Tradesmen',ssUrlPrefix + 'business-products/internet-data/business-solutions/tradesmen/index.htm');
g_navNode_1_2_5_3=g_navNode_1_2_5.addNode('ss-be-bus-sol-realestate','Real Estate',ssUrlPrefix + 'business-products/internet-data/business-solutions/realestate/index.htm');
g_navNode_1_3=g_navNode_1.addNode('ss-be-managed-services','Managed Services',ssUrlPrefix + 'business-products/managed-services/index.htm');
g_navNode_1_3_1=g_navNode_1_3.addNode('ss-be-services-fac-access','Facilities Access Non Carrier',ssUrlPrefix + 'business-products/managed-services/facilities-access-non-carrier/index.htm');
g_navNode_1_3_2=g_navNode_1_3.addNode('ss-be-network-services','IP Network Services',ssUrlPrefix + 'business-products/managed-services/ip-network-services/index.htm');
g_navNode_1_3_2_0=g_navNode_1_3_2.addNode('ss-be-services-ip-applications','IP Applications',ssUrlPrefix + 'business-products/managed-services/ip-network-services/ip-applications/index.htm');
g_navNode_1_3_2_1=g_navNode_1_3_2.addNode('ss-be-services-satellites','Iterra IP Satellites',ssUrlPrefix + 'business-products/managed-services/ip-network-services/iterra-ip-satellites/index.htm');
g_navNode_1_3_2_2=g_navNode_1_3_2.addNode('ss-be-services-next-network','Next IP Network',ssUrlPrefix + 'business-products/managed-services/ip-network-services/next-ip-network/index.htm');
g_navNode_1_3_2_3=g_navNode_1_3_2.addNode('ss-be-services-private-network','Private IP Networking',ssUrlPrefix + 'business-products/managed-services/ip-network-services/private-ip-networking/index.htm');
g_navNode_1_3_3=g_navNode_1_3.addNode('ss-be-machine-2-machine','Machine-2-Machine',ssUrlPrefix + 'business-products/managed-services/machine-2-machine/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_3_4=g_navNode_1_3.addNode('ss-be-services-radio-wireless','Managed Radio \x26 Wireless',ssUrlPrefix + 'business-products/managed-services/managed-radio-wireless/index.htm');
g_navNode_1_4=g_navNode_1.addNode('ss-be-mobiles','Mobiles',ssUrlPrefix + 'business-products/mobiles/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_4_1=g_navNode_1_4.addNode('791','Windows Phone 8',ssUrlPrefix + 'business-products/mobiles/windows-phone-8/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_4_2=g_navNode_1_4.addNode('ss-be-iphone','Apple',ssUrlPrefix + 'business-products/mobiles/apple/index.htm');
g_navNode_1_4_2_3=g_navNode_1_4_2.addNode('ss-be-apple-iphone-5','iPhone 5',ssUrlPrefix + 'business-products/mobiles/apple/iphone-5/index.htm','contributorOnly==FALSE','secondaryUrlVariableField==LightBoxes');
g_navNode_1_4_3=g_navNode_1_4.addNode('ss-be-bb','BlackBerry',ssUrlPrefix + 'business-products/mobiles/blackberry/index.htm','contributorOnly==FALSE');
g_navNode_1_4_3_3=g_navNode_1_4_3.addNode('ss-be-blackberry-z10','BlackBerry Z10',ssUrlPrefix + 'business-products/mobiles/blackberry/blackberry-z10/index.htm');
g_navNode_1_4_3_6=g_navNode_1_4_3.addNode('1105','Blackberry Q10',ssUrlPrefix + 'business-products/mobiles/blackberry/blackberry-q10/index.htm');
g_navNode_1_4_4=g_navNode_1_4.addNode('ss-be-htc','HTC',ssUrlPrefix + 'business-products/mobiles/htc/index.htm');
g_navNode_1_4_4_0=g_navNode_1_4_4.addNode('ss-be-htc-8s','Windows Phone 8S by HTC',ssUrlPrefix + 'business-products/mobiles/htc/windows-phone-8s-by-htc/index.htm');
g_navNode_1_4_4_1=g_navNode_1_4_4.addNode('ss-be-htc-8x','Windows Phone 8X by HTC',ssUrlPrefix + 'business-products/mobiles/htc/windows-phone-8x-by-htc/index.htm');
g_navNode_1_4_4_8=g_navNode_1_4_4.addNode('893','HTC One',ssUrlPrefix + 'business-products/mobiles/htc/htc-one/index.htm');
g_navNode_1_4_5=g_navNode_1_4.addNode('ss-be-lg','LG',ssUrlPrefix + 'business-products/mobiles/lg/index.htm','contributorOnly==FALSE');
g_navNode_1_4_5_0=g_navNode_1_4_5.addNode('ss-be-lg-optimus','LG Optimus G',ssUrlPrefix + 'business-products/mobiles/lg/lg-optimus-g/index.htm','contributorOnly==FALSE');
g_navNode_1_4_6=g_navNode_1_4.addNode('ss-be-motorola','Motorola',ssUrlPrefix + 'business-products/mobiles/motorola/index.htm');
g_navNode_1_4_6_1=g_navNode_1_4_6.addNode('ss-be-motorola-defy-plus','Motorola DEFY \x2b',ssUrlPrefix + 'business-products/mobiles/motorola/motorola-defy-plus/index.htm');
g_navNode_1_4_6_2=g_navNode_1_4_6.addNode('ss-be-motorola-razr-4g','Motorola RAZR HD',ssUrlPrefix + 'business-products/mobiles/motorola/motorola-razr-hd/index.htm');
g_navNode_1_4_6_3=g_navNode_1_4_6.addNode('ss-be-motorola-razr-m','Motorola RAZR M',ssUrlPrefix + 'business-products/mobiles/motorola/motorola-razr-m/index.htm');
g_navNode_1_4_7=g_navNode_1_4.addNode('ss-be-nokia','Nokia',ssUrlPrefix + 'business-products/mobiles/nokia/index.htm');
g_navNode_1_4_7_3=g_navNode_1_4_7.addNode('ss-be-nokia-lumia-920','Nokia Lumia 920',ssUrlPrefix + 'business-products/mobiles/nokia/nokia-lumia-920/index.htm','contributorOnly==FALSE');
g_navNode_1_4_7_4=g_navNode_1_4_7.addNode('1191','Nokia Lumia 925',ssUrlPrefix + 'business-products/mobiles/nokia/nokia-lumia-925/index.htm');
g_navNode_1_4_8=g_navNode_1_4.addNode('ss-be-samsung','Samsung',ssUrlPrefix + 'business-products/mobiles/samsung/index.htm');
g_navNode_1_4_8_0=g_navNode_1_4_8.addNode('ss-be-sams-galaxy-note-2','Samsung GALAXY Note 2',ssUrlPrefix + 'business-products/mobiles/samsung/samsung-galaxy-note-2/index.htm');
g_navNode_1_4_8_1=g_navNode_1_4_8.addNode('ss-be-sams-galaxy-nexus','Samsung GALAXY S II 4G',ssUrlPrefix + 'business-products/mobiles/samsung/samsung-galaxy-s2-4g/index.htm');
g_navNode_1_4_8_2=g_navNode_1_4_8.addNode('ss-be-samsung-galaxy-s-iii-4g','Samsung GALAXY S III 4G',ssUrlPrefix + 'business-products/mobiles/samsung/samsung-galaxy-s-iii-4g/index.htm');
g_navNode_1_4_8_3=g_navNode_1_4_8.addNode('894','Samsung GALAXY S4',ssUrlPrefix + 'business-products/mobiles/samsung/samsung-galaxy-s4/index.htm','contributorOnly==FALSE');
g_navNode_1_4_9=g_navNode_1_4.addNode('ss-be-sony','Sony',ssUrlPrefix + 'business-products/mobiles/sony/index.htm');
g_navNode_1_4_9_1=g_navNode_1_4_9.addNode('ss-be-sony-xperia-p','Sony Xperia P',ssUrlPrefix + 'business-products/mobiles/sony/sony-xperia-p/index.htm');
g_navNode_1_4_9_2=g_navNode_1_4_9.addNode('ss-be-sony-xperia-z','Sony Xperia Z',ssUrlPrefix + 'business-products/mobiles/sony/sony-xperia-z/index.htm');
g_navNode_1_4_10=g_navNode_1_4.addNode('ss-be-telstra','Telstra',ssUrlPrefix + 'business-products/mobiles/telstra/index.htm');
g_navNode_1_4_10_1=g_navNode_1_4_10.addNode('ss-be-telstra-easytouch-disc-3','Telstra EasyTouch Discovery 3',ssUrlPrefix + 'business-products/mobiles/telstra/telstra-easytouch-discovery-3/index.htm');
g_navNode_1_4_10_2=g_navNode_1_4_10.addNode('ss-be-telstra-explorer','Telstra Explorer',ssUrlPrefix + 'business-products/mobiles/telstra/telstra-explorer/index.htm');
g_navNode_1_4_10_3=g_navNode_1_4_10.addNode('ss-be-telstra-tough-2-t54','Telstra Tough 2 \x28T54\x29',ssUrlPrefix + 'business-products/mobiles/telstra/telstra-tough-2-t54/index.htm');
g_navNode_1_4_12=g_navNode_1_4.addNode('ss-be-mobile-services','Extra Services',ssUrlPrefix + 'business-products/mobiles/extra-services/index.htm');
g_navNode_1_4_12_0=g_navNode_1_4_12.addNode('ss-be-business-intl-packs','Business International Packs',ssUrlPrefix + 'business-products/mobiles/extra-services/business-international-packs/index.htm');
g_navNode_1_4_12_1=g_navNode_1_4_12.addNode('ss-be-internet-mob-datapacks','Mobile Data Packs',ssUrlPrefix + 'business-products/mobiles/extra-services/mobile-data-packs/index.htm');
g_navNode_1_4_12_2=g_navNode_1_4_12.addNode('ss-be-mobile-messaging','Messaging Applications',ssUrlPrefix + 'business-products/mobiles/extra-services/messaging-applications/index.htm');
g_navNode_1_4_12_3=g_navNode_1_4_12.addNode('ss-be-mobile-messagebank','MessageBank',ssUrlPrefix + 'business-products/mobiles/extra-services/messagebank/index.htm');
g_navNode_1_4_12_4=g_navNode_1_4_12.addNode('ss-be-mobile-applications','Mobile Business Applications',ssUrlPrefix + 'business-products/mobiles/extra-services/mobile-business-applications/index.htm');
g_navNode_1_4_12_5=g_navNode_1_4_12.addNode('ss-be-mobile-device-management','Telstra Mobile Device Management',ssUrlPrefix + 'business-products/mobiles/extra-services/telstra-mobile-device-management/index.htm');
g_navNode_1_4_13=g_navNode_1_4.addNode('ss-be-mobile-roaming','International Roaming',ssUrlPrefix + 'business-products/mobiles/international-roaming/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_4_13_0=g_navNode_1_4_13.addNode('ss-be-mobile-pricing-comp','Packs \x26 Plans',ssUrlPrefix + 'business-products/mobiles/international-roaming/packs-and-plans/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_1_4_13_1=g_navNode_1_4_13.addNode('ss-be-mobile-troubleshooting','Troubleshooting',ssUrlPrefix + 'business-products/mobiles/international-roaming/troubleshooting/index.htm');
g_navNode_1_4_13_2=g_navNode_1_4_13.addNode('ss-be-mobile-what-to-do','What do I need to do?',ssUrlPrefix + 'business-products/mobiles/international-roaming/what-to-do/index.htm');
g_navNode_1_4_14=g_navNode_1_4.addNode('ss-be-mobile-plans','Mobile Plans',ssUrlPrefix + 'business-products/mobiles/mobile-plans/index.htm');
g_navNode_1_4_14_0=g_navNode_1_4_14.addNode('ss-be-bus-mobile-advantage','Business Mobile Advantage',ssUrlPrefix + 'business-products/mobiles/mobile-plans/business-mobile-advantage/index.htm');
g_navNode_1_4_14_1=g_navNode_1_4_14.addNode('ss-be-bus-mobile-maximiser','Business Performance',ssUrlPrefix + 'business-products/mobiles/mobile-plans/business-performance/index.htm');
g_navNode_1_4_14_2=g_navNode_1_4_14.addNode('ss-be-no-lock-in-plans','No Lock-in Plans',ssUrlPrefix + 'business-products/mobiles/mobile-plans/no-lock-in-plans/index.htm');
g_navNode_1_4_14_3=g_navNode_1_4_14.addNode('1189','Business Performance Data Share Packages',ssUrlPrefix + 'business-products/mobiles/mobile-plans/business-performance-data-share-packages/index.htm');
g_navNode_1_4_17=g_navNode_1_4.addNode('ss-be-smart-antenna','Telstra Mobile Smart Antenna',ssUrlPrefix + 'business-products/mobiles/telstra-mobile-smart-antenna/index.htm');
g_navNode_1_4_18=g_navNode_1_4.addNode('ss-be-telstra-4g','Telstra 4G',ssUrlPrefix + 'business-products/mobiles/telstra-4g/index.htm');
g_navNode_1_5=g_navNode_1.addNode('ss-be-phone','Telephony',ssUrlPrefix + 'business-products/telephony/index.htm');
g_navNode_1_5_0=g_navNode_1_5.addNode('ss-be-telstra-business-systems','Telstra Business Systems',ssUrlPrefix + 'business-products/telephony/telstra-business-systems/index.htm');
g_navNode_1_5_1=g_navNode_1_5.addNode('ss-be-phone-services','Extra Services',ssUrlPrefix + 'business-products/telephony/extra-services/index.htm');
g_navNode_1_5_1_0=g_navNode_1_5_1.addNode('ss-be-phone-connections','New Connections',ssUrlPrefix + 'business-products/telephony/extra-services/new-connections/index.htm');
g_navNode_1_5_3=g_navNode_1_5.addNode('ss-be-phone-ip-telephony','IP Telephony',ssUrlPrefix + 'business-products/telephony/ip-telephony/index.htm');
g_navNode_1_5_4=g_navNode_1_5.addNode('ss-be-phone-plans','Plans \x26 Pricing',ssUrlPrefix + 'business-products/telephony/plans-pricing/index.htm');
g_navNode_1_5_4_1=g_navNode_1_5_4.addNode('ss-be-phone-plans-bus-line','BusinessLine Plans',ssUrlPrefix + 'business-products/telephony/plans-pricing/businessline-plans/index.htm');
g_navNode_1_5_4_2=g_navNode_1_5_4.addNode('ss-be-phone-plans-bus-connect','Business Connect Plans',ssUrlPrefix + 'business-products/telephony/plans-pricing/business-connect-plans/index.htm');
g_navNode_1_5_4_3=g_navNode_1_5_4.addNode('ss-be-phone-plans-voice-serv','Managed Voice Services',ssUrlPrefix + 'business-products/telephony/plans-pricing/managed-voice-services/index.htm');
g_navNode_1_5_5=g_navNode_1_5.addNode('ss-be-phone-wireless-voice','Wireless Voice',ssUrlPrefix + 'business-products/telephony/wireless-voice/index.htm');
g_navNode_1_6=g_navNode_1.addNode('ss-be-business-catalogue','Telstra Business Catalogue',ssUrlPrefix + 'business-products/business-catalogue/index.htm');
g_navNode_2=g_navNode_Root.addNode('ss-be-bundles','Bundles',ssUrlPrefix + 'bundles/index.htm');
g_navNode_2_0=g_navNode_2.addNode('ss-be-bundles-dig-business','Telstra Digital Business',ssUrlPrefix + 'bundles/telstra-digital-business/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_2_0_2=g_navNode_2_0.addNode('ss-be-bundles-dig-business-sup','Support',ssUrlPrefix + 'bundles/telstra-digital-business/support/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_2_1=g_navNode_2.addNode('ss-be-bundles-all-4-biz','All-4-Biz',ssUrlPrefix + 'bundles/all-4-biz/index.htm');
g_navNode_2_2=g_navNode_2.addNode('ss-be-bundles-perf-network','Business Performance Network',ssUrlPrefix + 'bundles/business-performance-network/index.htm');
g_navNode_2_3=g_navNode_2.addNode('ss-be-bundles-video-connect','Business Video Connect',ssUrlPrefix + 'bundles/business-video-connect/index.htm');
g_navNode_2_5=g_navNode_2.addNode('ss-be-bundles-biz-essentials','T-Bundle BizEssentials',ssUrlPrefix + 'bundles/t-bundle-bizessentials/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_3=g_navNode_Root.addNode('ss-be-enterprise-solutions','Enterprise Solutions',ssUrlPrefix + 'enterprise-solutions/index.htm');
g_navNode_3_0=g_navNode_3.addNode('ss-be-enterprise-cloud','Cloud Services',ssUrlPrefix + 'enterprise-solutions/cloud-services/index.htm');
g_navNode_3_0_7=g_navNode_3_0.addNode('1161','Collaboration Applications',ssUrlPrefix + 'enterprise-solutions/cloud-services/collaboration-applications/index.htm');
g_navNode_3_0_7_0=g_navNode_3_0_7.addNode('1162','Cloud Collaboration Microsoft',ssUrlPrefix + 'enterprise-solutions/cloud-services/collaboration-applications/cloud-collaboration-microsoft/index.htm');
g_navNode_3_0_7_1=g_navNode_3_0_7.addNode('1163','Microsoft Office 365 Enterprise',ssUrlPrefix + 'enterprise-solutions/cloud-services/collaboration-applications/microsoft-office-365-enterprise/index.htm');
g_navNode_3_0_7_2=g_navNode_3_0_7.addNode('1164','Microsoft Online Services',ssUrlPrefix + 'enterprise-solutions/cloud-services/collaboration-applications/microsoft-online-services/index.htm');
g_navNode_3_0_8=g_navNode_3_0.addNode('1165','Management Applications',ssUrlPrefix + 'enterprise-solutions/cloud-services/management-applications/index.htm');
g_navNode_3_0_9=g_navNode_3_0.addNode('1166','Security Applications',ssUrlPrefix + 'enterprise-solutions/cloud-services/security-applications/index.htm');
g_navNode_3_0_9_0=g_navNode_3_0_9.addNode('1167','Endpoint',ssUrlPrefix + 'enterprise-solutions/cloud-services/security-applications/endpoint/index.htm');
g_navNode_3_0_9_1=g_navNode_3_0_9.addNode('1168','Network',ssUrlPrefix + 'enterprise-solutions/cloud-services/security-applications/network/index.htm');
g_navNode_3_0_10=g_navNode_3_0.addNode('1169','Backup and Archiving',ssUrlPrefix + 'enterprise-solutions/cloud-services/backup-and-archiving/index.htm');
g_navNode_3_0_10_0=g_navNode_3_0_10.addNode('1170','PC',ssUrlPrefix + 'enterprise-solutions/cloud-services/backup-and-archiving/pc/index.htm');
g_navNode_3_0_10_1=g_navNode_3_0_10.addNode('1171','Server',ssUrlPrefix + 'enterprise-solutions/cloud-services/backup-and-archiving/server/index.htm');
g_navNode_3_0_10_2=g_navNode_3_0_10.addNode('1172','Email Archiving',ssUrlPrefix + 'enterprise-solutions/cloud-services/backup-and-archiving/Email-archiving/index.htm');
g_navNode_3_0_11=g_navNode_3_0.addNode('1173','Infrastructure',ssUrlPrefix + 'enterprise-solutions/cloud-services/infrastructure/index.htm');
g_navNode_3_0_11_0=g_navNode_3_0_11.addNode('1174','Data Centres',ssUrlPrefix + 'enterprise-solutions/cloud-services/infrastructure/data-centres/index.htm');
g_navNode_3_0_11_1=g_navNode_3_0_11.addNode('1175','Dedicated',ssUrlPrefix + 'enterprise-solutions/cloud-services/infrastructure/dedicated/index.htm');
g_navNode_3_0_11_2=g_navNode_3_0_11.addNode('1176','Shared',ssUrlPrefix + 'enterprise-solutions/cloud-services/infrastructure/shared/index.htm');
g_navNode_3_0_12=g_navNode_3_0.addNode('1177','Consulting',ssUrlPrefix + 'enterprise-solutions/cloud-services/consulting/index.htm');
g_navNode_3_1=g_navNode_3.addNode('ss-be-comms-collaboration','Communications \x26 Collaboration',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/index.htm');
g_navNode_3_1_0=g_navNode_3_1.addNode('ss-be-corporate-facilities','Conferencing Services',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/corporate-facilities/index.htm');
g_navNode_3_1_0_0=g_navNode_3_1_0.addNode('821','Video Conferencing',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/corporate-facilities/video-conferencing/index.htm');
g_navNode_3_1_0_1=g_navNode_3_1_0.addNode('822','Phone Conferencing',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/corporate-facilities/phone-conferencing/index.htm');
g_navNode_3_1_0_2=g_navNode_3_1_0.addNode('823','Web Conferencing',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/corporate-facilities/web-conferencing/index.htm');
g_navNode_3_1_0_3=g_navNode_3_1_0.addNode('831','Event Venues',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/corporate-facilities/event-venues/index.htm');
g_navNode_3_1_2=g_navNode_3_1.addNode('ss-be-comms-telephony','Enterprise Telephony',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/enterprise-telephony/index.htm');
g_navNode_3_1_2_0=g_navNode_3_1_2.addNode('ss-be-connect-ip-telephony','Connect IP Telephony',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/enterprise-telephony/connect-ip-telephony/index.htm');
g_navNode_3_1_2_1=g_navNode_3_1_2.addNode('ss-be-managed-voice-services','Managed Voice Services',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/enterprise-telephony/managed-voice-services/index.htm');
g_navNode_3_1_2_2=g_navNode_3_1_2.addNode('ss-be-sip-connect','SIP Connect',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/enterprise-telephony/sip-connect/index.htm');
g_navNode_3_1_3=g_navNode_3_1.addNode('ss-be-comms-unified-comms','Unified Communications',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/unified-communications/index.htm');
g_navNode_3_1_3_0=g_navNode_3_1_3.addNode('839','Telstra IP Telephony',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/unified-communications/telstra-ip-telephony/index.htm');
g_navNode_3_1_4=g_navNode_3_1.addNode('ss-be-comms-messaging','Whispir',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/messaging/index.htm');
g_navNode_3_1_5=g_navNode_3_1.addNode('ss-be-modern-meetings','Modern Meetings',ssUrlPrefix + 'enterprise-solutions/communications-collaboration/modern-meetings/index.htm');
g_navNode_3_2=g_navNode_3.addNode('ss-be-customer-contact','Customer Contact',ssUrlPrefix + 'enterprise-solutions/customer-contact/index.htm');
g_navNode_3_2_0=g_navNode_3_2.addNode('ss-be-contact-centres-services','Contact Centre Services',ssUrlPrefix + 'enterprise-solutions/customer-contact/contact-centres-services/index.htm');
g_navNode_3_2_1=g_navNode_3_2.addNode('ss-be-comms-inbound-calling','Inbound Calling',ssUrlPrefix + 'enterprise-solutions/customer-contact/inbound-calling/index.htm');
g_navNode_3_2_2=g_navNode_3_2.addNode('ss-be-managed-business-centres','Managed Business Centres',ssUrlPrefix + 'enterprise-solutions/customer-contact/managed-business-centres/index.htm');
g_navNode_3_2_3=g_navNode_3_2.addNode('ss-be-corporate-dialler','Telstra Corporate Dialler',ssUrlPrefix + 'enterprise-solutions/customer-contact/telstra-corporate-dialler/index.htm');
g_navNode_3_2_4=g_navNode_3_2.addNode('ss-be-telstra-network-contact','Telstra Network Contact Centre',ssUrlPrefix + 'enterprise-solutions/customer-contact/telstra-network-contact-centre/index.htm');
g_navNode_3_2_6=g_navNode_3_2.addNode('ss-be-unified-contact-centre','Telstra Unified Contact Centre Express',ssUrlPrefix + 'enterprise-solutions/customer-contact/telstra-unified-contact-centre-express/index.htm');
g_navNode_3_2_7=g_navNode_3_2.addNode('ss-be-unified-contact-centre-e','Unified Contact Centre',ssUrlPrefix + 'enterprise-solutions/customer-contact/unified-contact-centre/index.htm');
g_navNode_3_2_8=g_navNode_3_2.addNode('ss-be-web-contact-centres','Web Contact Centre',ssUrlPrefix + 'enterprise-solutions/customer-contact/web-contact-centre/index.htm');
g_navNode_3_3=g_navNode_3.addNode('ss-be-enterprise-industries','Industries',ssUrlPrefix + 'enterprise-solutions/industries/index.htm');
g_navNode_3_3_0=g_navNode_3_3.addNode('ss-be-industries-education','Education',ssUrlPrefix + 'enterprise-solutions/industries/education/index.htm');
g_navNode_3_3_1=g_navNode_3_3.addNode('ss-be-industries-finance','Financial Services',ssUrlPrefix + 'enterprise-solutions/industries/financial-services/index.htm');
g_navNode_3_3_2=g_navNode_3_3.addNode('632','Government',ssUrlPrefix + 'enterprise-solutions/industries/government/index.htm');
g_navNode_3_3_3=g_navNode_3_3.addNode('ss-be-industries-healthcare','Health',ssUrlPrefix + 'enterprise-solutions/industries/health/index.htm');
g_navNode_3_3_4=g_navNode_3_3.addNode('ss-be-industries-public-safety','Insurance',ssUrlPrefix + 'enterprise-solutions/industries/insurance/index.htm');
g_navNode_3_3_5=g_navNode_3_3.addNode('ss-be-industries-manufacturing','Manufacturing',ssUrlPrefix + 'enterprise-solutions/industries/manufacturing/index.htm');
g_navNode_3_3_6=g_navNode_3_3.addNode('ss-be-industries-media','Media',ssUrlPrefix + 'enterprise-solutions/industries/media/index.htm');
g_navNode_3_3_7=g_navNode_3_3.addNode('ss-be-industries-res-mining','Mining',ssUrlPrefix + 'enterprise-solutions/industries/mining/index.htm');
g_navNode_3_3_8=g_navNode_3_3.addNode('855','Public Safety',ssUrlPrefix + 'enterprise-solutions/industries/public-safety/index.htm');
g_navNode_3_3_9=g_navNode_3_3.addNode('ss-be-industries-hospitality','Retail',ssUrlPrefix + 'enterprise-solutions/industries/retail/index.htm');
g_navNode_3_3_10=g_navNode_3_3.addNode('ss-be-industries-trans-log','Supply Chain',ssUrlPrefix + 'enterprise-solutions/industries/supply-chain/index.htm');
g_navNode_3_3_11=g_navNode_3_3.addNode('840','Utilities',ssUrlPrefix + 'enterprise-solutions/industries/utilities/index.htm');
g_navNode_3_4=g_navNode_3.addNode('ss-be-industry-solutions','Industry Solutions',ssUrlPrefix + 'enterprise-solutions/industry-solutions/index.htm');
g_navNode_3_4_1=g_navNode_3_4.addNode('ss-be-industry-education','Education',ssUrlPrefix + 'enterprise-solutions/industry-solutions/education/index.htm');
g_navNode_3_4_2=g_navNode_3_4.addNode('ss-be-industry-health','Healthcare',ssUrlPrefix + 'enterprise-solutions/industry-solutions/health-care/index.htm');
g_navNode_3_4_3=g_navNode_3_4.addNode('ss-be-high-def-telehealth','High Definition Telehealth',ssUrlPrefix + 'enterprise-solutions/industry-solutions/high-definition-telehealth/index.htm');
g_navNode_3_4_4=g_navNode_3_4.addNode('ss-be-industry-public-safety','Public Safety Solutions',ssUrlPrefix + 'enterprise-solutions/industry-solutions/public-safety/index.htm');
g_navNode_3_4_4_0=g_navNode_3_4_4.addNode('ss-be-telstra-sptl-video-slns','Telstra Spatial Video Solutions',ssUrlPrefix + 'enterprise-solutions/industry-solutions/public-safety/telstra-spatial-video-solutions/index.htm');
g_navNode_3_4_5=g_navNode_3_4.addNode('ss-be-industry-sec-monitor','Security Monitoring',ssUrlPrefix + 'enterprise-solutions/industry-solutions/security-monitoring/index.htm');
g_navNode_3_4_6=g_navNode_3_4.addNode('ss-be-teleeducation','TeleEducation',ssUrlPrefix + 'enterprise-solutions/industry-solutions/teleeducation/index.htm');
g_navNode_3_4_7=g_navNode_3_4.addNode('ss-be-telehealth-gps-spec','Telehealth - GPs \x26 Specialists',ssUrlPrefix + 'enterprise-solutions/industry-solutions/telehealth-gps-specialists/index.htm');
g_navNode_3_5=g_navNode_3.addNode('ss-be-industry-dig-media-sol','Digital Media and Content Services',ssUrlPrefix + 'enterprise-solutions/digital-media-and-content-services/index.htm');
g_navNode_3_5_0=g_navNode_3_5.addNode('ss-be-live-event-streaming','Live Event Streaming',ssUrlPrefix + 'enterprise-solutions/digital-media-and-content-services/live-event-streaming/index.htm');
g_navNode_3_5_1=g_navNode_3_5.addNode('795','Telstra Retail Connect',ssUrlPrefix + 'enterprise-solutions/digital-media-and-content-services/retail-connect/index.htm');
g_navNode_3_5_2=g_navNode_3_5.addNode('ss-be-content-distribution','Content Delivery Network',ssUrlPrefix + 'enterprise-solutions/digital-media-and-content-services/content-distribution-management-services/index.htm');
g_navNode_3_5_3=g_navNode_3_5.addNode('ss-be-digital-signage','Digital Signage and Enterprise Casting',ssUrlPrefix + 'enterprise-solutions/digital-media-and-content-services/digital-signage-enterprise-casting/index.htm');
g_navNode_3_6=g_navNode_3.addNode('ss-be-bundles-manage-networks','Managed Data Networks',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/index.htm');
g_navNode_3_6_0=g_navNode_3_6.addNode('ss-be-bundles-app-vis-usage','Application Visibility and Usage',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/application-visibility-usage/index.htm');
g_navNode_3_6_1=g_navNode_3_6.addNode('ss-be-branch-office-consol','Branch Office IT Consolidation',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/branch-office-it-consolidation/index.htm');
g_navNode_3_6_2=g_navNode_3_6.addNode('ss-be-bundles-managed-router','Managed Router',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/managed-router/index.htm');
g_navNode_3_6_3=g_navNode_3_6.addNode('ss-be-bundles-managed-switch','Managed Switch',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/managed-switch/index.htm');
g_navNode_3_6_4=g_navNode_3_6.addNode('ss-be-bundles-wireless-lan','Managed Wi-Fi',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/wireless-lan/index.htm');
g_navNode_3_6_5=g_navNode_3_6.addNode('ss-be-network-care-plus','Network Care Plus',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/network-care-plus/index.htm','contributorOnly==FALSE');
g_navNode_3_6_6=g_navNode_3_6.addNode('ss-be-bundles-pro-secure','Proactive Secure',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/proactive-secure/index.htm');
g_navNode_3_6_7=g_navNode_3_6.addNode('ss-be-reporting-services','Reporting Services',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/reporting-services/index.htm');
g_navNode_3_6_8=g_navNode_3_6.addNode('ss-be-bundles-wan-optimisation','WAN Optimisation',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/wan-optimisation/index.htm');
g_navNode_3_6_9=g_navNode_3_6.addNode('ss-be-bundles-wireless-wan','Wireless WAN',ssUrlPrefix + 'enterprise-solutions/managed-data-networks/wireless-wan/index.htm');
g_navNode_3_7=g_navNode_3.addNode('ss-be-mobile-assets-workforce','Mobile Assets \x26 Workforce',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/index.htm');
g_navNode_3_7_0=g_navNode_3_7.addNode('ss-be-whereis-navigator','Garmin Navigator',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/garmin-navigator/index.htm');
g_navNode_3_7_1=g_navNode_3_7.addNode('ss-be-mobility-fleet-care','Mobility Fleet Care Plus',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/mobility-fleet-care-plus/index.htm');
g_navNode_3_7_2=g_navNode_3_7.addNode('ss-be-office-mobility','Office Mobility',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/office-mobility/index.htm');
g_navNode_3_7_2_0=g_navNode_3_7_2.addNode('ss-be-broadband-plus','Enterprise Mobile Broadband Plus',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/office-mobility/enterprise-mobile-broadband-plus/index.htm');
g_navNode_3_7_2_1=g_navNode_3_7_2.addNode('ss-be-managing-fleets','Managing Smartphone Fleets',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/office-mobility/managing-smartphone-fleets/index.htm');
g_navNode_3_7_2_2=g_navNode_3_7_2.addNode('ss-be-office-in-a-box','Office in a Box',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/office-mobility/office-in-a-box/index.htm');
g_navNode_3_7_2_3=g_navNode_3_7_2.addNode('ss-be-telstra-mob-connect','Telstra Mobile Connect Solutions',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/office-mobility/telstra-mobile-connect-solutions/index.htm');
g_navNode_3_7_3=g_navNode_3_7.addNode('ss-be-remote-management','Remote \x26 Mobile Assets Management',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/remote-mobile-assets-management/index.htm');
g_navNode_3_7_3_0=g_navNode_3_7_3.addNode('ss-be-navman-wireless','Navman Wireless GPS Fleet Management',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/remote-mobile-assets-management/navman-wireless-gps-fleet-management/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_3_7_3_1=g_navNode_3_7_3.addNode('ss-be-telstra-wireless-m2m','Telstra Wireless M2M Control Centre',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/remote-mobile-assets-management/telstra-wireless-m2m-control-centre/index.htm');
g_navNode_3_7_3_2=g_navNode_3_7_3.addNode('ss-be-trimble-manager','Trimble GeoManager',ssUrlPrefix + 'enterprise-solutions/mobile-assets-workforce/remote-mobile-assets-management/trimble-geomanager/index.htm');
g_navNode_3_8=g_navNode_3.addNode('ss-be-network-solutions','Network Solutions',ssUrlPrefix + 'enterprise-solutions/network-solutions/index.htm');
g_navNode_3_8_0=g_navNode_3_8.addNode('ss-be-application-assured-netw','Application Assured Networking',ssUrlPrefix + 'enterprise-solutions/network-solutions/application-assured-networking/index.htm');
g_navNode_3_8_1=g_navNode_3_8.addNode('733','Optical data services',ssUrlPrefix + 'enterprise-solutions/network-solutions/optical-data-services/index.htm','contributorOnly==FALSE');
g_navNode_3_8_2=g_navNode_3_8.addNode('ss-be-network-internet-direct','Internet Direct',ssUrlPrefix + 'enterprise-solutions/network-solutions/internet-direct/index.htm');
g_navNode_3_8_3=g_navNode_3_8.addNode('ss-be-network-ipvpn','IP VPN',ssUrlPrefix + 'enterprise-solutions/network-solutions/ipvpn/index.htm');
g_navNode_3_8_4=g_navNode_3_8.addNode('ss-be-network-ipv6','IPv6',ssUrlPrefix + 'enterprise-solutions/network-solutions/ipv6/index.htm');
g_navNode_3_8_5=g_navNode_3_8.addNode('ss-be-network-trans-tasman','Trans Tasman',ssUrlPrefix + 'enterprise-solutions/network-solutions/trans-tasman/index.htm');
g_navNode_3_9=g_navNode_3.addNode('ss-be-bundles-next-gen','Network Applications and Services',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/index.htm');
g_navNode_3_9_0=g_navNode_3_9.addNode('ss-be-professional-services','Professional Services',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/professional-services/index.htm');
g_navNode_3_9_0_0=g_navNode_3_9_0.addNode('ss-be-technology-consulting','Technology Consulting Team',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/professional-services/technology-consulting-team/index.htm');
g_navNode_3_9_0_1=g_navNode_3_9_0.addNode('ss-be-cloud-consulting','Cloud Consulting',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/professional-services/cloud-consulting/index.htm');
g_navNode_3_9_0_2=g_navNode_3_9_0.addNode('ss-be-security-consulting','Security Consulting',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/professional-services/security-consulting/index.htm');
g_navNode_3_9_0_2_0=g_navNode_3_9_0_2.addNode('ss-be-security-vul-service','Vulnerability Assessment Service',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/professional-services/security-consulting/vulnerability-assessment-service/index.htm');
if (SSContributor)
{
g_navNode_3_9_0_3=g_navNode_3_9_0.addNode('ss-be-detailed-design','EXPIRED-Detailed Design',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/professional-services/detailed-design/index.htm','contributorOnly==TRUE');
}
g_navNode_3_9_0_4=g_navNode_3_9_0.addNode('ss-be-network-consulting','Network Consulting',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/professional-services/network-consulting/index.htm','contributorOnly==FALSE');
g_navNode_3_9_0_5=g_navNode_3_9_0.addNode('ss-be-unified-communications-c','Unified Communications Consulting',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/professional-services/unified-communications-consulting/index.htm','contributorOnly==FALSE');
g_navNode_3_9_1=g_navNode_3_9.addNode('ss-be-nextgen-managed-services','Managed Services',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/managed-services/index.htm');
g_navNode_3_9_1_0=g_navNode_3_9_1.addNode('ss-be-business-resumption-serv','Business Resumption Service',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/managed-services/business-resumption-services/index.htm');
g_navNode_3_9_2=g_navNode_3_9.addNode('ss-be-int-serv-and-outsourcing','Integrated Services and Outsourcing',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/integrated-services-and-outsourcing/index.htm');
g_navNode_3_9_2_0=g_navNode_3_9_2.addNode('ss-be-integrated-service-desk','Integrated Service Desk',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/integrated-services-and-outsourcing/integrated-service-desk/index.htm');
g_navNode_3_9_2_1=g_navNode_3_9_2.addNode('853','Integrated Operations Management',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/integrated-services-and-outsourcing/integrated-operations-management/index.htm');
g_navNode_3_9_4=g_navNode_3_9.addNode('ss-be-bundles-serv-man','Service Management Framework',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/service-management-framework/index.htm');
g_navNode_3_9_4_0=g_navNode_3_9_4.addNode('ss-be-con-architect-and-design','Consulting, Architecture and Design',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/service-management-framework/consulting-architecture-and-design/index.htm');
g_navNode_3_9_4_1=g_navNode_3_9_4.addNode('ss-be-program-and-project-mgmt','Program and Project Management',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/service-management-framework/program-and-project-management/index.htm');
g_navNode_3_9_4_2=g_navNode_3_9_4.addNode('ss-be-deployment-and-intgtn','Deployment and Integration',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/service-management-framework/deployment-and-integration/index.htm');
g_navNode_3_9_4_3=g_navNode_3_9_4.addNode('ss-be-service-desk','Service Desk',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/service-management-framework/service-desk/index.htm');
g_navNode_3_9_4_4=g_navNode_3_9_4.addNode('ss-be-service-operations','Service Operations',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/service-management-framework/service-operations/index.htm');
g_navNode_3_9_4_5=g_navNode_3_9_4.addNode('ss-be-serv-imp-and-reporting','Service Improvement and Reporting',ssUrlPrefix + 'enterprise-solutions/network-applications-and-services/service-management-framework/service-improvement-and-reporting/index.htm');
g_navNode_3_10=g_navNode_3.addNode('629','Partners \x26 Alliances',ssUrlPrefix + 'enterprise-solutions/partners-alliances/index.htm');
g_navNode_3_12=g_navNode_3.addNode('1129','Security Services',ssUrlPrefix + 'enterprise-solutions/security-services/index.htm');
g_navNode_3_12_2=g_navNode_3_12.addNode('1133','Security Protection',ssUrlPrefix + 'enterprise-solutions/security-services/security-protection/index.htm');
g_navNode_3_12_2_0=g_navNode_3_12_2.addNode('1134','Managed Firewall Service',ssUrlPrefix + 'enterprise-solutions/security-services/security-protection/managed-firewall-service/index.htm');
g_navNode_3_12_2_1=g_navNode_3_12_2.addNode('1135','Intrusion Prevention Service',ssUrlPrefix + 'enterprise-solutions/security-services/security-protection/intrusion-prevention-service/index.htm');
g_navNode_3_12_2_2=g_navNode_3_12_2.addNode('1137','Denial of Service Protection',ssUrlPrefix + 'enterprise-solutions/security-services/security-protection/denial-of-service-protection/index.htm');
g_navNode_3_12_2_3=g_navNode_3_12_2.addNode('1138','Email Protection',ssUrlPrefix + 'enterprise-solutions/security-services/security-protection/email-protection/index.htm');
g_navNode_3_12_2_4=g_navNode_3_12_2.addNode('1139','Web Protection',ssUrlPrefix + 'enterprise-solutions/security-services/security-protection/web-protection/index.htm');
g_navNode_3_12_2_5=g_navNode_3_12_2.addNode('1136','IP Gateway',ssUrlPrefix + 'enterprise-solutions/security-services/security-protection/ip-gateway/index.htm');
g_navNode_3_12_3=g_navNode_3_12.addNode('1131','Security Consulting',ssUrlPrefix + 'enterprise-solutions/security-services/security-consulting/index.htm');
g_navNode_3_12_4=g_navNode_3_12.addNode('1130','Security Intelligence',ssUrlPrefix + 'enterprise-solutions/security-services/security-intelligence/index.htm');
g_navNode_4=g_navNode_Root.addNode('ss-be-resource-insights','Resources \x26 Insights',ssUrlPrefix + 'resources-insights/index.htm');
g_navNode_4_0=g_navNode_4.addNode('872','Towards a Clever Australia',ssUrlPrefix + 'resources-insights/clever-australia-report/index.htm','contributorOnly==FALSE');
g_navNode_4_0_0=g_navNode_4_0.addNode('877','Compare Your Organisation',ssUrlPrefix + 'resources-insights/clever-australia-report/compare-your-organisation/index.htm','contributorOnly==FALSE');
g_navNode_4_0_1=g_navNode_4_0.addNode('878','Reports',ssUrlPrefix + 'resources-insights/clever-australia-report/reports/index.htm','contributorOnly==FALSE');
g_navNode_4_0_1_0=g_navNode_4_0_1.addNode('880','Enterprise Report',ssUrlPrefix + 'resources-insights/clever-australia-report/reports/enterprise-report/index.htm','contributorOnly==FALSE','secondaryUrlVariableField==LightBoxes');
g_navNode_4_0_1_1=g_navNode_4_0_1.addNode('879','Business Report',ssUrlPrefix + 'resources-insights/clever-australia-report/reports/business-report/index.htm','contributorOnly==FALSE','secondaryUrlVariableField==LightBoxes');
g_navNode_4_0_1_2=g_navNode_4_0_1.addNode('881','Government Report',ssUrlPrefix + 'resources-insights/clever-australia-report/reports/government-report/index.htm','contributorOnly==FALSE','secondaryUrlVariableField==LightBoxes');
g_navNode_4_0_2=g_navNode_4_0.addNode('882','Industry Insights',ssUrlPrefix + 'resources-insights/clever-australia-report/industry-insights/index.htm');
g_navNode_4_1=g_navNode_4.addNode('867','The Overland Office',ssUrlPrefix + 'resources-insights/the-overland-office/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_1_2=g_navNode_4_1.addNode('887','Case studies',ssUrlPrefix + 'resources-insights/the-overland-office/case-studies/index.htm');
g_navNode_4_1_3=g_navNode_4_1.addNode('888','Meet the team',ssUrlPrefix + 'resources-insights/the-overland-office/meet-the-team/index.htm');
g_navNode_4_2=g_navNode_4.addNode('ss-be-acc-quarterly-offers','Accelerate Quarterly Offers',ssUrlPrefix + 'resources-insights/accelerate-quarterly-offers/index.htm');
g_navNode_4_2_0=g_navNode_4_2.addNode('ss-be-dedicated-cloud-hosting','Dedicated Cloud Hosting',ssUrlPrefix + 'resources-insights/accelerate-quarterly-offers/dedicated-cloud-hosting/index.htm');
g_navNode_4_2_1=g_navNode_4_2.addNode('ss-be-hosted-sap','Hosted SAP',ssUrlPrefix + 'resources-insights/accelerate-quarterly-offers/hosted-sap/index.htm');
g_navNode_4_2_2=g_navNode_4_2.addNode('ss-be-aqo-intgtd-service-desk','Integrated Service Desk',ssUrlPrefix + 'resources-insights/accelerate-quarterly-offers/integrated-service-desk/index.htm');
g_navNode_4_2_3=g_navNode_4_2.addNode('ss-be-wan-optimisation','WAN Optimisation',ssUrlPrefix + 'resources-insights/accelerate-quarterly-offers/wan-optimisation/index.htm');
g_navNode_4_4=g_navNode_4.addNode('ss-be-case-studies-2','Case Studies',ssUrlPrefix + 'resources-insights/case-studies/index.htm','contributorOnly==FALSE','secondaryUrlVariableField==MainContent');
g_navNode_4_4_0=g_navNode_4_4.addNode('ss-be-cs2-cloud-computing','Cloud computing',ssUrlPrefix + 'resources-insights/case-studies/cloud-computing/index.htm','secondaryUrlVariableField==MainContent');
g_navNode_4_4_1=g_navNode_4_4.addNode('ss-be-cs2-ccc','Customer contact centres',ssUrlPrefix + 'resources-insights/case-studies/customer-contact-centres/index.htm','secondaryUrlVariableField==MainContent');
g_navNode_4_4_2=g_navNode_4_4.addNode('ss-be-customer-service','Customer service',ssUrlPrefix + 'resources-insights/case-studies/customer-service/index.htm','secondaryUrlVariableField==MainContent');
g_navNode_4_4_3=g_navNode_4_4.addNode('ss-be-cs2-enterprise-com','Enterprise communications',ssUrlPrefix + 'resources-insights/case-studies/enterprise-communications/index.htm','secondaryUrlVariableField==MainContent');
g_navNode_4_4_5=g_navNode_4_4.addNode('ss-be-cs2-mobility','Mobility',ssUrlPrefix + 'resources-insights/case-studies/mobility/index.htm','secondaryUrlVariableField==MainContent');
g_navNode_4_4_6=g_navNode_4_4.addNode('ss-be-cs2-network','Network',ssUrlPrefix + 'resources-insights/case-studies/network/index.htm','secondaryUrlVariableField==MainContent');
g_navNode_4_4_7=g_navNode_4_4.addNode('ss-be-cs2-security','Security',ssUrlPrefix + 'resources-insights/case-studies/security/index.htm','secondaryUrlVariableField==MainContent');
g_navNode_4_4_8=g_navNode_4_4.addNode('ss-be-cs2-next-gen-services','Services',ssUrlPrefix + 'resources-insights/case-studies/next-gen-services/index.htm','secondaryUrlVariableField==MainContent');
g_navNode_4_5=g_navNode_4.addNode('ss-be-case-studies-aud-podcast','Audio Podcasts ',ssUrlPrefix + 'resources-insights/audio-podcasts/index.htm','contributorOnly==FALSE','secondaryUrlVariableField==MainContent');
g_navNode_4_6=g_navNode_4.addNode('ss-be-case-studies-videos','Videos',ssUrlPrefix + 'resources-insights/videos/index.htm','contributorOnly==FALSE','secondaryUrlVariableField==MainContent');
g_navNode_4_7=g_navNode_4.addNode('ss-be-case-studies-whitepapers','Whitepapers',ssUrlPrefix + 'resources-insights/whitepapers/index.htm','contributorOnly==FALSE','secondaryUrlVariableField==MainContent');
g_navNode_4_9=g_navNode_4.addNode('ss-be-next-newsletter','NEXT Newsletter',ssUrlPrefix + 'resources-insights/next-newsletter/index.htm');
g_navNode_4_11=g_navNode_4.addNode('ss-be-connected-enterprise','Connected Enterprise',ssUrlPrefix + 'resources-insights/connected-enterprise/index.htm');
g_navNode_4_14=g_navNode_4.addNode('ss-be-the-clever-australian','The Clever Australian',ssUrlPrefix + 'resources-insights/the-clever-australian/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_0=g_navNode_4_14.addNode('582','The Inspiration',ssUrlPrefix + 'resources-insights/the-clever-australian/faces/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_1=g_navNode_4_14.addNode('678','Clever Australians',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-australians/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_1_0=g_navNode_4_14_1.addNode('ss-be-ca-linfox','Linfox',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-australians/linfox/index.htm','contributorOnly==FALSE');
g_navNode_4_14_1_1=g_navNode_4_14_1.addNode('923','Komatsu',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-australians/komatsu/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_1_2=g_navNode_4_14_1.addNode('ss-be-ca-greyhound','Greyhound',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-australians/greyhound/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_1_3=g_navNode_4_14_1.addNode('677','Dominos Pizza',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-australians/dominos-pizza/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_1_4=g_navNode_4_14_1.addNode('ss-be-ca-coca-cola','Coca-Cola Amatil',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-australians/coca-cola-amatil/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_1_5=g_navNode_4_14_1.addNode('ss-be-ca-channel-nine','Channel Nine',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-australians/channel-nine/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_1_6=g_navNode_4_14_1.addNode('ss-be-nissan-leaf-m2m','Nissan Leaf M2M',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-australians/nissan-leaf-m2m/index.htm');
g_navNode_4_14_2=g_navNode_4_14.addNode('679','Clever Connections',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-connections/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_2_0=g_navNode_4_14_2.addNode('ss-be-aurrium','Arrium',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-connections/arrium/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_14_2_1=g_navNode_4_14_2.addNode('ss-be-sundale','Sundale',ssUrlPrefix + 'resources-insights/the-clever-australian/clever-connections/sundale/index.htm');
g_navNode_4_15=g_navNode_4.addNode('ss-be-smarter-business-ideas','Smarter Business Ideas',ssUrlPrefix + 'resources-insights/smarter-business-ideas/index.htm');
g_navNode_4_17=g_navNode_4.addNode('ss-be-look-whois-talking','Look Who\'s Talking',ssUrlPrefix + 'resources-insights/look-who-is-talking/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_4_17_0=g_navNode_4_17.addNode('ss-be-industry-resources','Industry Resources',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/index.htm');
g_navNode_4_17_0_0=g_navNode_4_17_0.addNode('903','Health',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/health/index.htm');
g_navNode_4_17_0_1=g_navNode_4_17_0.addNode('904','Finance',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/finance/index.htm');
g_navNode_4_17_0_2=g_navNode_4_17_0.addNode('905','Education',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/education/index.htm');
g_navNode_4_17_0_3=g_navNode_4_17_0.addNode('906','Manufacturing',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/manufacturing/index.htm');
g_navNode_4_17_0_4=g_navNode_4_17_0.addNode('ss-be-is-retail','Retail',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/retail/index.htm');
g_navNode_4_17_0_5=g_navNode_4_17_0.addNode('ss-be-is-media','Media',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/media/index.htm');
g_navNode_4_17_0_6=g_navNode_4_17_0.addNode('ss-be-is-mining','Mining',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/mining/index.htm');
g_navNode_4_17_0_7=g_navNode_4_17_0.addNode('ss-be-is-utilities','Utilities',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/utilities/index.htm');
g_navNode_4_17_0_8=g_navNode_4_17_0.addNode('ss-be-is-government','Government',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/government/index.htm');
g_navNode_4_17_0_9=g_navNode_4_17_0.addNode('919','Supply Chain',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/supply-chain/index.htm');
g_navNode_4_17_0_10=g_navNode_4_17_0.addNode('920','Insurance',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/insurance/index.htm');
g_navNode_4_17_0_11=g_navNode_4_17_0.addNode('921','Public Safety',ssUrlPrefix + 'resources-insights/look-who-is-talking/industry-resources/public-safety/index.htm');
g_navNode_5=g_navNode_Root.addNode('ss-be-account-services','Account Services',ssUrlPrefix + 'account-services/index.htm');
g_navNode_5_1=g_navNode_5.addNode('ss-be-account-register-enroll','Register \x26 Enrol',ssUrlPrefix + 'account-services/register-enrol/index.htm');
g_navNode_5_2=g_navNode_5.addNode('ss-be-account-ss-tools','My Account',ssUrlPrefix + 'account-services/my-account/index.htm');
g_navNode_5_2_1=g_navNode_5_2.addNode('ss-be-billing-support','Billing Support',ssUrlPrefix + 'account-services/my-account/billing-support/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_5_2_2=g_navNode_5_2.addNode('ss-be-networks-security','Manage Network',ssUrlPrefix + 'account-services/my-account/manage-network/index.htm');
g_navNode_5_2_3=g_navNode_5_2.addNode('ss-be-usage-reporting','My Account Help',ssUrlPrefix + 'account-services/my-account/my-account-help/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_5_2_4=g_navNode_5_2.addNode('ss-be-self-service-tools-faqs','FAQs',ssUrlPrefix + 'account-services/my-account/faqs/index.htm');
g_navNode_5_3=g_navNode_5.addNode('ss-be-customer-tools','Your Telstra Tools',ssUrlPrefix + 'account-services/your-telstra-tools/index.htm');
g_navNode_5_3_5=g_navNode_5_3.addNode('ss-be-manage-account','Manage Account',ssUrlPrefix + 'account-services/your-telstra-tools/manage-account/index.htm');
g_navNode_5_3_5_0=g_navNode_5_3_5.addNode('ss-be-feature-network-changes','Feature \x26 Network Changes',ssUrlPrefix + 'account-services/your-telstra-tools/manage-account/feature-network-changes/index.htm');
g_navNode_5_3_5_1=g_navNode_5_3_5.addNode('ss-be-manage-account-mobiles','Mobiles',ssUrlPrefix + 'account-services/your-telstra-tools/manage-account/mobiles/index.htm');
g_navNode_5_3_5_2=g_navNode_5_3_5.addNode('ss-be-voice-and-data','Voice \x26 Data',ssUrlPrefix + 'account-services/your-telstra-tools/manage-account/voice-and-data/index.htm');
g_navNode_5_3_6=g_navNode_5_3.addNode('ss-be-manage-network','Manage Network',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/index.htm');
g_navNode_5_3_6_0=g_navNode_5_3_6.addNode('ss-be-customnet','CustomNet',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/customnet/index.htm');
g_navNode_5_3_6_1=g_navNode_5_3_6.addNode('ss-be-digital-data-services','Digital Data Services',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/digital-data-services/index.htm');
g_navNode_5_3_6_2=g_navNode_5_3_6.addNode('ss-be-ethernet-man','Ethernet MAN',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/ethernet-man/index.htm');
g_navNode_5_3_6_3=g_navNode_5_3_6.addNode('ss-be-firewall-intrusion-detec','Firewall \x26 Intrusion Detection',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/firewall-intrusion-detection/index.htm');
g_navNode_5_3_6_4=g_navNode_5_3_6.addNode('ss-be-inbound-security-service','Inbound \x26 Security Services',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/inbound-security-services/index.htm');
g_navNode_5_3_6_5=g_navNode_5_3_6.addNode('ss-be-internet-direct','Internet Direct',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/internet-direct/index.htm');
g_navNode_5_3_6_6=g_navNode_5_3_6.addNode('ss-be-ip-gateway','Manage IP',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/manage-ip/index.htm');
g_navNode_5_3_6_7=g_navNode_5_3_6.addNode('ss-be-managed-voice','Managed Voice',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/managed-voice/index.htm');
g_navNode_5_3_6_8=g_navNode_5_3_6.addNode('ss-be-remote-working','Remote Working',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/remote-working/index.htm');
g_navNode_5_3_6_9=g_navNode_5_3_6.addNode('ss-be-tipt-adds-moves-changes','Manage TIPT',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/manage-tipt/index.htm');
g_navNode_5_3_6_10=g_navNode_5_3_6.addNode('ss-be-telstra-locator','Telstra Locator',ssUrlPrefix + 'account-services/your-telstra-tools/manage-network/telstra-locator/index.htm');
g_navNode_5_3_7=g_navNode_5_3.addNode('ss-be-view-and-analyse','View \x26 Analyse',ssUrlPrefix + 'account-services/your-telstra-tools/view-and-analyse/index.htm');
g_navNode_5_3_8=g_navNode_5_3.addNode('ss-be-customer-tools-faqs','FAQs',ssUrlPrefix + 'account-services/your-telstra-tools/faqs/index.htm');
g_navNode_5_3_9=g_navNode_5_3.addNode('ss-be-terms-of-use','Terms of use',ssUrlPrefix + 'account-services/your-telstra-tools/terms-of-use/index.htm');
g_navNode_5_4=g_navNode_5.addNode('ss-change-ownership','Updating Your Account',ssUrlPrefix + 'account-services/update-your-account/index.htm','contributorOnly==FALSE');
g_navNode_5_5=g_navNode_5.addNode('828','T Analyst',ssUrlPrefix + 'account-services/t-analyst/index.htm','contributorOnly==FALSE');
g_navNode_6=g_navNode_Root.addNode('ss-be-help-support','Help \x26 Support',ssUrlPrefix + 'help-support/index.htm');
g_navNode_6_0=g_navNode_6.addNode('ss-be-announcements','Announcements',ssUrlPrefix + 'help-support/announcements/index.htm','secondaryUrlVariableField==MainContent');
g_navNode_6_1=g_navNode_6.addNode('ss-be-help-brochures','Brochures',ssUrlPrefix + 'help-support/brochures/index.htm');
g_navNode_6_3=g_navNode_6.addNode('ss-be-contact-us','Contact Us',ssUrlPrefix + 'help-support/contact-us/index.htm','secondaryUrlVariableField==LightBoxes');
g_navNode_6_3_1=g_navNode_6_3.addNode('ss-be-find-nearest-bus-partner','Find Nearest Business Partner',ssUrlPrefix + 'help-support/contact-us/find-nearest-business-partner/index.htm');
g_navNode_6_3_2=g_navNode_6_3.addNode('ss-be-t-suite-dealers','T-Suite Application Partners',ssUrlPrefix + 'help-support/contact-us/t-suite-application-partners/index.htm');
g_navNode_6_3_3=g_navNode_6_3.addNode('ss-be-make-a-complaint','Make a complaint',ssUrlPrefix + 'help-support/contact-us/make-a-complaint/index.htm');
g_navNode_6_3_4=g_navNode_6_3.addNode('ss-be-business-visit-store','Visit a Store',ssUrlPrefix + 'help-support/contact-us/visit-store/index.htm');
g_navNode_6_4=g_navNode_6.addNode('ss-be-help-faqs','FAQs',ssUrlPrefix + 'help-support/faqs/index.htm');
g_navNode_6_5=g_navNode_6.addNode('ss-be-help-glossary','Glossary',ssUrlPrefix + 'help-support/glossary/index.htm');
g_navNode_6_7=g_navNode_6.addNode('ss-be-help-my-offer-summary','Critical Information Summary',ssUrlPrefix + 'help-support/critical-information-summary/index.htm');
g_navNode_6_8=g_navNode_6.addNode('ss-be-help-software-downloads','Software Downloads',ssUrlPrefix + 'help-support/software-downloads/index.htm');
g_navNode_6_9=g_navNode_6.addNode('ss-be-tid-information','TID Technical Information',ssUrlPrefix + 'help-support/tid-information/index.htm');
g_navNode_6_10=g_navNode_6.addNode('ss-be-help-tipt-res','TIPT Resources',ssUrlPrefix + 'help-support/tipt-resources/index.htm');
g_navNode_6_10_0=g_navNode_6_10.addNode('ss-be-how-to-videos','How to Videos',ssUrlPrefix + 'help-support/tipt-resources/how-to-videos/index.htm');
g_navNode_6_10_1=g_navNode_6_10.addNode('ss-be-tipt-application-downloa','Application Downloads',ssUrlPrefix + 'help-support/tipt-resources/application-downloads/index.htm');
g_navNode_6_10_2=g_navNode_6_10.addNode('ss-be-tipt-call-centre','Call Centre',ssUrlPrefix + 'help-support/tipt-resources/call-centre/index.htm');
g_navNode_6_10_3=g_navNode_6_10.addNode('ss-be-tipt-configure-service','Configuring Your Service',ssUrlPrefix + 'help-support/tipt-resources/configuring-your-service/index.htm');
g_navNode_6_10_4=g_navNode_6_10.addNode('ss-be-tipt-customer-administra','Customer Administrator',ssUrlPrefix + 'help-support/tipt-resources/customer-administrator/index.htm');
g_navNode_6_10_5=g_navNode_6_10.addNode('ss-be-tipt-hw-sw-requirements','Hardware \x26 Software Requirements',ssUrlPrefix + 'help-support/tipt-resources/hardware-and-software-requirements/index.htm');
g_navNode_6_10_6=g_navNode_6_10.addNode('ss-be-tipt-phone-users','Phone Users',ssUrlPrefix + 'help-support/tipt-resources/phone-users/index.htm');
g_navNode_6_10_7=g_navNode_6_10.addNode('ss-be-tipt-receptionist','Receptionist',ssUrlPrefix + 'help-support/tipt-resources/receptionist/index.htm');
g_navNode_6_10_8=g_navNode_6_10.addNode('ss-be-tipt-tipt-major-upgrade','TIPT Platform Major Upgrade',ssUrlPrefix + 'help-support/tipt-resources/tipt-platform-major-upgrade/index.htm');
g_navNode_6_10_9=g_navNode_6_10.addNode('ss-be-tipt-whats-new','What\'s New',ssUrlPrefix + 'help-support/tipt-resources/whats-new/index.htm');
g_navNode_6_11=g_navNode_6.addNode('ss-be-why-telstra','Why Telstra',ssUrlPrefix + 'help-support/why-telstra/index.htm');
