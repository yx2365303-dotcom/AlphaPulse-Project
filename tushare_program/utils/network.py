"""
网络修复工具 - VPN 环境下的 SSL/超时修复
"""
import urllib3
import requests


def patch_ssl_and_timeout():
    """禁用 SSL 警告并设置默认超时"""
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    _original_session_request = requests.Session.request
    
    def _patched_session_request(self, method, url, **kwargs):
        kwargs['verify'] = False
        if 'timeout' not in kwargs:
            kwargs['timeout'] = 30
        return _original_session_request(self, method, url, **kwargs)
    
    requests.Session.request = _patched_session_request
