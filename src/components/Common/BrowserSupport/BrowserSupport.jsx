/* eslint-disable*/
import React from 'react';
import PropTypes from 'prop-types';
import Driver from '../../../lib/Driver';

export default class BrowserSupport extends React.Component {
    static isIE() { return /*@cc_on!@*/false || !!document.documentMode; }
    static isEdge() { return !this.isIE() && !!window.StyleMedia; }
    static isChrome() { return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime); }
    static isEdgeChromium() { return this.isChrome() && (navigator.userAgent.indexOf("Edg") != -1) }
    static isOpera() { return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; }
    static isFirefox() { return typeof InstallTrigger !== 'undefined'; }
    static isSafari() { return /constructor/i.test(window.HTMLElement) || ((p) => { return p.toString() === '[object SafariRemoteNotification]'; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification)); }

    static getBrowserName() {
        return this.isOpera() ? 'Opera' :
            this.isChrome() ? 'Chrome' :
            this.isFirefox() ? 'Firefox' :
            this.isEdgeChromium() ? 'Chromium Edge' :
            this.isEdge() ? 'Edge' :
            this.isSafari() ? 'Safari' :
            this.isIE() ? 'Internet Explorer' : 'Unknown browser';
    }

    static isHttpConnectionUsed() {
        return window.location.protocol === 'http:';
    }

    static browserU2FSupport() {
        // Checking for u2f support
        return !!window.u2f;
    }

    static isWindowsOS() {
        return (window.navigator.platform === 'Win32' || window.navigator.platform === 'Win64');
    }

    constructor(props) {
        super(props);
    }

    getBrowserNotify() {
        return `Your browser is ${this.constructor.getBrowserName()}`;
    }

    render() {
        const { d } = this.props;

        return (
            <div className="Input_flexed_block">
                {this.getBrowserNotify()}
            </div>
        );
    }
}

BrowserSupport.propTypes = {
    d: PropTypes.instanceOf(Driver).isRequired,
};
