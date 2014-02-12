FSR.surveydefs = [{
    name: 'browse',
    section: 'b-enterprise',
    mc_id: 'IBcs25SIN0000000L',
    mc_id_sub: 'IBcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 100,
        lf: 2
    },
    pin: 1,
    include: {
        urls: ['www.business.att.com', 'networkingexchangeblog.att.com']
    },
    platform: 'desktop',
    pool: 75
}, {
    name: 'browse',
    section: 'b-community',
    mc_id: 'IBcs25SIN0000000L',
    mc_id_sub: 'IBcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Thank you for visiting AT&T Business Community. You have been randomly selected to participate in a customer satisfaction survey to let us know how we can improve your experience on the AT&T Web site.",
            noticeAboutSurvey: "The survey is designed to measure your entire experience, please look for it at the <u>conclusion</u> of your visit.",
            attribution: "This survey is conducted by an independent company ForeSee, on behalf of the site you are visiting.",
            closeInviteButtonText: "Click to close.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll give feedback"
        }]
    },
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 100,
        lf: 1
    },
    pin: 1,
    include: {
        urls: ['bizcommunity.att.com']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'tablet',
    section: 'c-forums',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            locale: "en"
        }], [{
            reverseButtons: false,
            headline: "Thank you for helping!",
            blurb: "Please provide your email address or phone number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
            attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
            declineButton: "Cancel",
            acceptButton: "email/text me",
            locale: "en",
            mobileExitDialog: {
                support: "b", //e for email only, s for sms only, b for both
                inputMessage: "email or phone number",
                emailMeButtonText: "email me",
                textMeButtonText: "text me",
                fieldRequiredErrorText: "Enter a phone number or email address",
                invalidFormatErrorText: "Format should be: name@domain.com or 123-456-7890"
            }
        }]]
    },
    platform: 'tablet',
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 75,
        lf: 2
    },
    include: {
        urls: ['getsocial.att.com']
    },
    pool: 100
}, {
    name: 'browse',
    section: 'c-forums',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs25SIN0000000L',
    invite: {
        when: 'onentry',
        dialogs: [{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Thank you for visiting the AT&T Forums. You have been randomly selected to participate in a customer satisfaction survey to let us know how we can improve your experience on the AT&T Web site.",
            noticeAboutSurvey: "The survey is designed to measure your entire experience, please look for it at the <u>conclusion</u> of your visit.",
            attribution: "This survey is conducted by an independent company ForeSee, on behalf of the site you are visiting.",
            closeInviteButtonText: "Click to close.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll give feedback"
        }]
    },
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 75,
        lf: 2
    },
    tracker: {
        url: 'tracker_f.html'
    },
    pin: 1,
    include: {
        urls: ['getsocial.att.com']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'tablet',
    section: 'c-forums',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            locale: "en"
        }], [{
            reverseButtons: false,
            headline: "Thank you for helping!",
            blurb: "Please provide your email address or phone number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
            attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
            declineButton: "Cancel",
            acceptButton: "email/text me",
            locale: "en",
            mobileExitDialog: {
                support: "b", //e for email only, s for sms only, b for both
                inputMessage: "email or phone number",
                emailMeButtonText: "email me",
                textMeButtonText: "text me",
                fieldRequiredErrorText: "Enter a phone number or email address",
                invalidFormatErrorText: "Format should be: name@domain.com or 123-456-7890"
            }
        }]]
    },
    platform: 'tablet',
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 75,
        lf: 4
    },
    include: {
        urls: ['forums.att.com']
    },
    pool: 100
}, {
    name: 'browse',
    section: 'c-forums',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs25SIN0000000L',
    invite: {
        when: 'onentry',
        dialogs: [{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Thank you for visiting the AT&T Forums. You have been randomly selected to participate in a customer satisfaction survey to let us know how we can improve your experience on the AT&T Web site.",
            noticeAboutSurvey: "The survey is designed to measure your entire experience, please look for it at the <u>conclusion</u> of your visit.",
            attribution: "This survey is conducted by an independent company ForeSee, on behalf of the site you are visiting.",
            closeInviteButtonText: "Click to close.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll give feedback"
        }]
    },
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 75,
        lf: 4
    },
    tracker: {
        url: 'tracker_f.html'
    },
    pin: 1,
    include: {
        urls: ['forums.att.com']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'browse',
    section: 'b-support',
    mc_id: 'IBcs25SIN0000000L',
    mc_id_sub: 'IBcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 30,
        lf: 3
    },
    pin: 1,
    include: {
        urls: ['/businesssupport/']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'browse',
    section: 'b-bid',
    mc_id: 'IBcs25SIN0000000L',
    mc_id_sub: 'IBcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 25,
        lf: 2
    },
    pin: 1,
    include: {
        urls: ['att.com/smallbusiness']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'browse',
    section: 'b-poc',
    mc_id: 'IBcs25SIN0000000L',
    mc_id_sub: 'IBcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
        what: 'qualifier'
    },
    qualifier: {
        url: 'qualifying2.html'
    },
    criteria: {
        sp: 100,
        lf: 3
    },
    pin: 1,
    include: {
        urls: ['/businesscare']
    },
    platform: 'desktop',
    pool: 25
}, {
    name: 'browse',
    section: 'b-premier-store',
    mc_id: 'IBcs25SIN0000000L',
    mc_id_sub: 'IBcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
        what: 'qualifier'
    },
    qualifier: {
        url: 'qualifying2.html'
    },
    criteria: {
        sp: 95,
        lf: 5
    },
    pin: 1,
    include: {
        urls: ['/business/']
    },
    platform: 'desktop',
    pool: 25
}, {
    name: 'tablet',
    section: 'c-account-mgmt',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            locale: "en"
        }], [{
            reverseButtons: false,
            headline: "Thank you for helping!",
            blurb: "Please provide your email address or phone number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
            attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
            declineButton: "Cancel",
            acceptButton: "email/text me",
            locale: "en",
            mobileExitDialog: {
                support: "b", //e for email only, s for sms only, b for both
                inputMessage: "email or phone number",
                emailMeButtonText: "email me",
                textMeButtonText: "text me",
                fieldRequiredErrorText: "Enter a phone number or email address",
                invalidFormatErrorText: "Format should be: name@domain.com or 123-456-7890"
            }
        }]]
    },
    platform: 'tablet',
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 5.59,
        lf: 2
    },
    include: {
        urls: ['www.att.com/olam/', '/eos']
    },
    pool: 100
}, {
    name: 'browse',
    section: 'c-account-mgmt',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
        what: 'qualifier'
    },
    criteria: {
        sp: 5.59,
        lf: 2
    },
    include: {
        urls: ['www.att.com/olam/', '/eos']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'tablet',
    section: 'c-support',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            locale: "en"
        }], [{
            reverseButtons: false,
            headline: "Thank you for helping!",
            blurb: "Please provide your email address or phone number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
            attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
            declineButton: "Cancel",
            acceptButton: "email/text me",
            locale: "en",
            mobileExitDialog: {
                support: "b", //e for email only, s for sms only, b for both
                inputMessage: "email or phone number",
                emailMeButtonText: "email me",
                textMeButtonText: "text me",
                fieldRequiredErrorText: "Enter a phone number or email address",
                invalidFormatErrorText: "Format should be: name@domain.com or 123-456-7890"
            }
        }]]
    },
    pop: {
        when: 'later'
    },
    platform: 'tablet',
    criteria: {
        sp: 11.50,
        lf: 2
    },
    include: {
        urls: ['/esupport/', '/support/', '/answer-center/', '/supportLandingAction', '/tutorialSupportAction', '/phoneDeviceSupportAction', '/supportByTopicAction', '/featuresSupportAction', /\/repair\/processing.do\?processingJSP=TroubleDescription/, 'uverserepair.att.com/uverse/an/submitReport.do', 'uverserepair.att.com/uverse/an/viewReport.do', '/devicehowto/']
    },
    pool: 100
}, {
    name: 'browse',
    section: 'c-support',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
        what: 'qualifier'
    },
    criteria: {
        sp: 11.50,
        lf: 2
    },
    include: {
        urls: ['/esupport/', '/support/', '/answer-center/', '/supportLandingAction', '/tutorialSupportAction', '/phoneDeviceSupportAction', '/supportByTopicAction', '/featuresSupportAction', /\/repair\/processing.do\?processingJSP=TroubleDescription/, 'uverserepair.att.com/uverse/an/submitReport.do', 'uverserepair.att.com/uverse/an/viewReport.do', '/devicehowto/']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'tablet',
    section: 'c-wireline-upper-funnel',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            locale: "en"
        }], [{
            reverseButtons: false,
            headline: "Thank you for helping!",
            blurb: "Please provide your email address or phone number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
            attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
            declineButton: "Cancel",
            acceptButton: "email/text me",
            locale: "en",
            mobileExitDialog: {
                support: "b", //e for email only, s for sms only, b for both
                inputMessage: "email or phone number",
                emailMeButtonText: "email me",
                textMeButtonText: "text me",
                fieldRequiredErrorText: "Enter a phone number or email address",
                invalidFormatErrorText: "Format should be: name@domain.com or 123-456-7890"
            }
        }]]
    },
    pop: {
        when: 'later'
    },
    platform: 'tablet',
    criteria: {
        sp: 3.90,
        lf: 3
    },
    include: {
        urls: ['www.att.com/shop/(?!((.)*wireless(.)*))']
    },
    pool: 100
}, {
    name: 'browse',
    section: 'c-wireline-upper-funnel',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
        what: 'qualifier'
    },
    criteria: {
        sp: 3.90,
        lf: 3
    },
    include: {
        urls: ['www.att.com/shop/(?!((.)*wireless(.)*))']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'tablet',
    section: 'c-wireline-sales',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            locale: "en"
        }], [{
            reverseButtons: false,
            headline: "Thank you for helping!",
            blurb: "Please provide your email address or phone number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
            attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
            declineButton: "Cancel",
            acceptButton: "email/text me",
            locale: "en",
            mobileExitDialog: {
                support: "b", //e for email only, s for sms only, b for both
                inputMessage: "email or phone number",
                emailMeButtonText: "email me",
                textMeButtonText: "text me",
                fieldRequiredErrorText: "Enter a phone number or email address",
                invalidFormatErrorText: "Format should be: name@domain.com or 123-456-7890"
            }
        }]]
    },
    pop: {
        when: 'later'
    },
    platform: 'tablet',
    criteria: {
        sp: 67.62,
        lf: 3
    },
    include: {
        urls: ['/gen/', '/apps/supern/', 'att.com/dsl']
    },
    pool: 100
}, {
    name: 'browse',
    section: 'c-wireline-sales',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
        what: 'qualifier'
    },
    criteria: {
        sp: 67.62,
        lf: 3
    },
    include: {
        urls: ['/gen/', '/apps/supern/', 'att.com/dsl']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'tablet',
    section: 'c-wireless-sales',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            locale: "en"
        }], [{
            reverseButtons: false,
            headline: "Thank you for helping!",
            blurb: "Please provide your email address or phone number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
            attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
            declineButton: "Cancel",
            acceptButton: "email/text me",
            locale: "en",
            mobileExitDialog: {
                support: "b", //e for email only, s for sms only, b for both
                inputMessage: "email or phone number",
                emailMeButtonText: "email me",
                textMeButtonText: "text me",
                fieldRequiredErrorText: "Enter a phone number or email address",
                invalidFormatErrorText: "Format should be: name@domain.com or 123-456-7890"
            }
        }]]
    },
    pop: {
        when: 'later'
    },
    platform: 'tablet',
    criteria: {
        sp: 7.65,
        lf: 4
    },
    include: {
        urls: ['wireless.att.com', 'www.att.com/shop/wireless/']
    },
    pool: 100
}, {
    name: 'browse',
    section: 'c-wireless-sales',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
        what: 'qualifier'
    },
    criteria: {
        sp: 7.65,
        lf: 4
    },
    include: {
        urls: ['wireless.att.com', 'www.att.com/shop/wireless/']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'tablet',
    section: 'c-uverse-sales',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            locale: "en"
        }], [{
            reverseButtons: false,
            headline: "Thank you for helping!",
            blurb: "Please provide your email address or phone number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
            attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
            declineButton: "Cancel",
            acceptButton: "email/text me",
            locale: "en",
            mobileExitDialog: {
                support: "b", //e for email only, s for sms only, b for both
                inputMessage: "email or phone number",
                emailMeButtonText: "email me",
                textMeButtonText: "text me",
                fieldRequiredErrorText: "Enter a phone number or email address",
                invalidFormatErrorText: "Format should be: name@domain.com or 123-456-7890"
            }
        }]]
    },
    pop: {
        when: 'later'
    },
    platform: 'tablet',
    criteria: {
        sp: 90,
        lf: 3
    },
    include: {
        urls: ['uvp/home', 'att.com/u-verse']
    },
    pool: 100
}, {
    name: 'browse',
    section: 'c-uverse-sales',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
        what: 'qualifier'
    },
    criteria: {
        sp: 90,
        lf: 3
    },
    include: {
        urls: ['uvp/home', 'att.com/u-verse']
    },
    platform: 'desktop',
    pool: 100
}, {
    name: 'tablet',
    section: 'test',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry',
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            locale: "en"
        }], [{
            reverseButtons: false,
            headline: "Thank you for helping!",
            blurb: "Please provide your email address or phone number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
            attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
            declineButton: "Cancel",
            acceptButton: "email/text me",
            locale: "en",
            mobileExitDialog: {
                support: "b", //e for email only, s for sms only, b for both
                inputMessage: "email or phone number",
                emailMeButtonText: "email me",
                textMeButtonText: "text me",
                fieldRequiredErrorText: "Enter a phone number or email address",
                invalidFormatErrorText: "Format should be: name@domain.com or 123-456-7890"
            }
        }]]
    },
    pop: {
        when: 'later'
    },
    platform: 'tablet',
    criteria: {
        sp: 100,
        lf: 2
    },
    include: {
        urls: ['mobility-consumer.web.att.com']
    },
    pool: 100
}, {
    name: 'browse',
    section: 'test',
    mc_id: 'ICcs25SIN0000000L',
    mc_id_sub: 'ICcs4CSUB0000000L',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
        what: 'qualifier'
    },
    criteria: {
        sp: 100,
        lf: 2
    },
    include: {
        urls: ['mobility-consumer.web.att.com']
    },
    platform: 'desktop',
    pool: 100
}];
FSR.properties = {
    repeatdays : 90,

    repeatoverride : false,

    altcookie : {
    },

    language : {
        locale : 'en'
    },

    exclude : {
    },

    zIndexPopup : 10000,

    ignoreWindowTopCheck : false,

    ipexclude : 'fsr$ip',

    mobileHeartbeat : {
        delay : 60, /*mobile on exit heartbeat delay seconds*/
        max : 3600  /*mobile on exit heartbeat max run time seconds*/
    },

    invite : {

        // For no site logo, comment this line:
        siteLogo : "sitelogo.gif",

        /* Desktop */
        dialogs : [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Thank you for visiting our website. You have been selected to participate in a brief customer satisfaction survey to let us know how we can improve your experience.",
            noticeAboutSurvey: "The survey is designed to measure your entire experience, please look for it at the <u>conclusion</u> of your visit.",
            attribution: "This survey is conducted by an independent company ForeSee, on behalf of the site you are visiting.",
            closeInviteButtonText: "Click to close.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll give feedback"
        }]],
		
        /* Mobile On Exit
        dialogs : [
                [ {
                    reverseButtons: false,
                    headline: "We'd welcome your feedback!",
                    blurb: "Can we email or text you later a brief customer satisfaction survey so we can improve your mobile experience?",
                    attribution: "Conducted by ForeSee.",
                    declineButton: "No, thanks",
                    acceptButton: "Yes, I'll help"
                } ],
                [ {
                    reverseButtons: false,
                    headline: "Thank you for helping!",
            		blurb: "Please provide your email address or mobile number (US and CA only). After your visit we'll send you a link to the survey. Text Messaging rates apply.",
                    attribution: "ForeSee's <a class='fsrPrivacy' href='//www.foresee.com/privacy-policy.shtml' target='_blank'>Privacy Policy</a>",
                    declineButton: "Cancel",
                    acceptButton: "email/text me",
                    mobileExitDialog: {
                        support:"b", //e for email only, s for sms only, b for both
                        inputMessage:"email or mobile number",
                        emailMeButtonText:"email me",
                        textMeButtonText:"text me",
                        fieldRequiredErrorText:"Enter a mobile number or email address",
                        invalidFormatErrorText:"Format should be: name@domain.com or 123-456-7890"
                    }
                } ] ],
        */

        exclude: {
            local: ['target_action=up_launchXPa', 'LaunchExpressPayAction.do', 'billSummarySwithchingAction.do', 'u-verse/availability/index.jsp', 'u-verse/shop/customize', '/default.jsp$', '/u-verse/$', '/mystore', '/cart/', '/lnp/account-information.jsp', '/lnp/eligibility-check.jsp', 'checkout', 'alRatePlanAction.olamexecute', 'gotoBedRock.olamexecute', 'phones_items.jsp', 'popup', 'reportActionForm=commonPaymentForm', '/submitQuickStart.do', 'dashboardAction.olamexecute', 'loginAction.olamexecute', 'logout.olamexecute', 'forgotPasswordAction.olamexecute', 'enterEmailForgotId', 'uverseDashboardAction.olamexecute', 'forgotPasswordAction.doview', '/olam/loginAction', 'enterEmailForgotId.myworld', 'enterAccountNumberForgotId.myworld', 'enterEmailOrZipForgotId.myworld', 'validateAccountDetailsForgotId.myworld', '/enterprise/profile/reqaddlinfo/', '/enterprise/profile/update/', '/enterprise/profile/activate/', '/enterprise/profile/accprotcont/msg=newuser&profile=null/', '/enterprise/profile/signin/', 'swot.sbc.com', 'csr-myaccount.cingular.net', '/u-verse/explore/default.jsp', '/creditPolicy.perform', '/BillingCreditCheckAction.form', '/channel-lineup.jsp', '/creditcard-information.jsp', '/customer-information.jsp', '/existing-services.jsp', '/MoveOrderStartAction.form', '/number-transfer-authorization.jsp', '/PersonalizeServicesAction.form', '/programming-packages.html', '/safescan-questions.jsp', '/SecurityDepositAction.form', '/unable-to-complete.jsp', 'cprodmasx.att.com/commonLogin/igate_wam/controller.do', 'session-time-out-modal.jsp', 'www06.sbc.com/myaccount/Controller', 'mobility-consumer.web.att.com/sites/attcom/social/CSAT_Test/Page3.html', '/commonlogin/igate_wam/controller.do', '/dsl/shop/virtual/sessiontimeout.jsp', '/eos/processlogin/', '/popups/', '/olam/loginaction.olamexecute', '/olam/logindisplay.olamexecute', '/olam/telcodashboardaction.olamexecute', '/u-verse/availability/', '/u-verse/explore/uvpop.html', '/virtual/chataccepted/', '/virtual/chatdeclined/', '/virtual/olam/promo/', '/businesscenter/', '/cell-phone-service/cell-phone-sales/promotion/a-list.jsp', '/cell-phone-service/welcome/', '/virtual/chat/', '/loc/pages/', 'localization.att.com', 'olam/passthroughAction', 'www.att.com/$', 'www.att.com/#', 'www.att.com/shop/availability', 'ICKIAT0000000000L', '/helpdesk/', 'slidRegistrationAction.olamexecute', 'enterUserIdSlidFpwd.myworld', 'userregistrationpage', 'postpage', 'replypage', '/spanish', '/phoneupgrade/', '/userloginpage', 'billSummarySwitchingAction.do', '/shop/cart/cartsummary.html', 'getsocial.att.com/admin/', 'getsocial.att.com/login.jspa', 'getsocial.att.com/logout.jspa', 'getsocial.att.com/create-account.jspa', 'getsocial.att.com/emailPasswordToken', 'getsocial.att.com/forgot-username', 'getsocial.att.com/terms-and-conditions.jspa', 'forums.att.com$', 'forums.att.com/$','forums.att.com/t5/user/userloginpage', 'forums.att.com/t5/user/userregistrationpage', 'forums.att.com/t5/About-The-AT-T-Community', 'forums.att.com/t5/Announcements/Community-Forum-Guidelines', 'forums.att.com/t5/kudos/kudosleaderboardpage', 'forums.att.com/t5/forums/usersonlinepage', 'forums.att.com/t5/user/viewprofilepage', 'forums.att.com/t5/user/myprofilepage', 'forums.att.com/t5/forums/searchpage', 'forums.att.com/t5/forums/postpage/board-id/', 'forums.att.com/t5/forums/replypage', 'forums.att.com/t5/Foro-en-espa%C3%B1ol/ct-p/spanish', 'submitSLIDEmailForgotIdSlid.myworld', 'forgotEmailForgotIdSlid.myworld', 'validateAccountForgotIdSlid.myworld', 'validateFirstAndLastNameForgotIdSlid.myworld', '/olam/unauth/fpwdEnterUserId.myworld', '/olam/unauth/fpwdValidateUserInfo.myworld', '/commonLogin/igate_wam/checkSQA.do', '/commonLogin/igate_wam/multiLogin.do', '/wp-admin'],
            referrer: []
        },
        include : {
            local : [ '.' ]
        },

        delay : 0,
        timeout : 0,

        hideOnClick : false,

        hideCloseButton : false,

        css : 'foresee-dhtml.css',

        hide : [],

        hideFlash: false,

        type : 'dhtml',
        /* desktop */
        // url: 'invite.html'
        /* mobile */
        url : 'invite-mobile.html',
        back: 'url'
        
        //SurveyMutex: 'SurveyMutex'
    },

    tracker : {
        width : '690',
        height : '415',
        timeout : 3,
        adjust : true,
        alert : {
            enabled : true,
            message : 'The survey is now available.'
        },
        url : 'tracker.html'
    },

    survey : {
        width : 690,
        height : 600
    },

    qualifier : {
        footer : '<div div id=\"fsrcontainer\"><div style=\"float:left;width:80%;font-size:8pt;text-align:left;line-height:12px;\">This survey is conducted by an independent company ForeSee,<br>on behalf of the site you are visiting.</div><div style=\"float:right;font-size:8pt;\"><a target="_blank" title="Validate TRUSTe privacy certification" href="//privacy-policy.truste.com/click-with-confidence/ctv/en/www.foreseeresults.com/seal_m"><img border=\"0\" src=\"{%baseHref%}truste.png\" alt=\"Validate TRUSTe Privacy Certification\"></a></div></div>',
        width : '690',
        height : '600',
        bgcolor : '#333',
        opacity : 0.7,
        x : 'center',
        y : 'center',
        delay : 0,
        buttons : {
            accept : 'Continue'
        },
        hideOnClick : false,
        css : 'foresee-dhtml.css',
        url : 'qualifying.html'
    },

    cancel : {
        url : 'cancel.html',
        width : '690',
        height : '400'
    },

    pop : {
        what : 'survey',
        after : 'leaving-site',
        pu : false,
        tracker : true
    },

    meta : {
        referrer : true,
        terms : true,
        ref_url : false,
        url : true,
        url_params : false,
        user_agent : false,
        entry : false,
        entry_params : false
    },

    events : {
        enabled : true,
        id : true,
        codes : {
            purchase : 800,
            items : 801,
            dollars : 802,
            followup : 803,
            information : 804,
            content : 805
        },
        pd : 7,
        custom : {}
    },

    previous : false,

	analytics : {
		google_local : false,
		google_remote : false
	},

    cpps: {
        mc: {
            source: 'variable',
            name: 'FSR._sd().mc_id_sub'
        },
        sd: {
            source: 'variable',
            name: 'FSR._sd().section'
        },
        config_version: {
            source: 'variable',
            name: '$$FSR.configuration_version'
        },
        code_version: {
            source: 'variable',
            name: '$$FSR.version'
        },
        uverse_avail_test: {
            source: 'variable',
            name: 'DCSext.wtEligResult'
        },
        wt_ProfileID: {
            source: 'variable',
            name: 'DCSext.wtATTProfileID'
        },
        wt_EBSegment: {
            source: 'variable',
            name: 'DCSext.wtATTEBSegment'
        },
        wt_NEUser: {
            source: 'variable',
            name: 'DCSext.wtATTNEUser'
        },
        wt_Role: {
            source: 'variable',
            name: 'DCSext.wtRole'
        },
        poc_login: {
            source: 'url',
            init: 'no',
            patterns: [{
                regex: /\/businesscare\/index.jsp\?wtPN=DashboardLandingPage/,
                value: 'yes'
            }, {
                regex: '/businesscare/asynch/processing_login.jsp',
                value: 'yes'
            }, {
                regex: '/businesscare/index.jsp',
                value: 'yes'
            }, {
                regex: '/business/main_login/account_groups.jsp',
                value: 'yes'
            }, {
                regex: '/business/shop/shop_cru_home.jsp',
                value: 'yes'
            }]
        },
        bus_support: {
            source: 'url',
            init: 'no',
            patterns: [{
                regex: '/businesssupport/',
                value: 'yes'
            }]
        },
        ufix: {
            source: 'url',
            init: 'no',
            patterns: [{
                regex: 'ufix.att.com',
                value: 'yes'
            }]
        },
        AB_Test_Page: {
            source: 'variable',
            name: 'DCSext.wtABTest'
        },
        Eligible_Living_Unit: {
            source: 'variable',
            name: 'DCSext.wtELUID',
            mode: 'append'
        },
        Eligible_Living_Unit_Address_ID: {
            source: 'variable',
            name: 'DCSext.wtAddressID',
            mode: 'append'
        },
        HardRock_Avail_Submit: {
            source: 'variable',
            name: 'DCSext.wtEvent',
            pin: ['HRock_Check_Avail_Submit']
        },
        Uverse_Avail_Result: {
            source: 'variable',
            name: 'DCSext.wtUverseAvailResult',
            mode: 'append'
        },
        DSL_Avail_Result: {
            source: 'variable',
            name: 'DCSext.wtDSLAvailResult',
            mode: 'append'
        },
        Access_Line_Avail_Result: {
            source: 'variable',
            name: 'DCSext.wtAccessLnAvailResult',
            mode: 'append'
        },
        HardRock_Bundles_Page_Landing: {
            source: 'function',
            value: function(){
                if (window.DCSext && DCSext.wtPN) {
                    if (DCSext.wtPN == 'HRock Bundles Landing') {
                        return 'y'
                    }
                }
                return '';
            }
        },
        HardRock_Uverse_Page_Landing: {
            source: 'function',
            value: function(){
                if (window.DCSext && DCSext.wtPN) {
                    if (DCSext.wtPN == 'HRock Uverse Landing') {
                        return 'y'
                    }
                }
                return '';
            }
        },
        HardRock_Wireless_Page_Landing: {
            source: 'function',
            value: function(){
                if (window.DCSext && DCSext.wtPN) {
                    if (DCSext.wtPN == 'HRock Wireless Landing') {
                        return 'y'
                    }
                }
                return '';
            }
        },
        HardRock_Television_Page_Landing: {
            source: 'function',
            value: function(){
                if (window.DCSext && DCSext.wtPN) {
                    if (DCSext.wtPN == 'HRock Television Landing') {
                        return 'y'
                    }
                }
                return '';
            }
        },
        HardRock_Internet_Page_Landing: {
            source: 'function',
            value: function(){
                if (window.DCSext && DCSext.wtPN) {
                    if (DCSext.wtPN == 'HRock Internet Landing') {
                        return 'y'
                    }
                }
                return '';
            }
        },
        HardRock_Home_Phone_Page_Landing: {
            source: 'function',
            value: function(){
                if (window.DCSext && DCSext.wtPN) {
                    if (DCSext.wtPN == 'HRock Home Phone Landing') {
                        return 'y'
                    }
                }
                return '';
            }
        },
        HardRock_Special_Offers_Page_Landing: {
            source: 'function',
            value: function(){
                if (window.DCSext && DCSext.wtPN) {
                    if (DCSext.wtPN == 'HRock Special Offers Landing') {
                        return 'y'
                    }
                }
                return '';
            }
        },
        HardRock_Shopping_Support_Page_Landing: {
            source: 'function',
            value: function(){
                if (window.DCSext && DCSext.wtPN) {
                    if (DCSext.wtPN == 'HRock Shopping Support Landing') {
                        return 'y'
                    }
                }
                return '';
            }
        },
        ATT_GblSearch: {
            source: 'variable',
            name: 'WT.oss',
            mode: 'append'
        },
        Upgrader_Flow: {
            source: 'url',
            patterns: [{
                regex: 'www.att.com/phoneupgrade/',
                value: 'YES'
            }]
        },
        Registered: {
            source: 'variable',
            name: 'Registered'
        },
        Rank: {
            source: 'variable',
            name: 'Rank'
        },
        Count: {
            source: 'variable',
            name: 'Count'
        },
        app_visitor_cookie: {
            source: 'cookie',
            name: 'browserid'
        },
		forums_J: {
            source: 'url',
            init: 'N',
            patterns: [{
                regex: 'getsocial.att.com',
                value: 'Y'
            }]
        },
        forums_L: {
            source: 'url',
            init: 'N',
            patterns: [{
                regex: 'forums.att.com',
                value: 'Y'
            }]
        }
    },

    mode : 'hybrid'
};