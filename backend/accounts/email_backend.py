import smtplib
import socket

from django.core.mail.backends.smtp import EmailBackend as DjangoSMTPBackend


class IPv4SMTP(smtplib.SMTP):
    """
    A plain smtplib.SMTP that forces IPv4 when resolving the mail server's
    address. Needed because some hosts (Render included) resolve
    smtp.gmail.com to an IPv6 address but don't have working IPv6 outbound
    routing, causing an immediate "Network is unreachable" error before
    the connection even gets a chance to fall back to IPv4.
    """

    def _get_socket(self, host, port, timeout):
        if timeout is not None and not timeout:
            raise ValueError("Non-blocking socket (timeout=0) is not supported")
        addr_info = socket.getaddrinfo(host, port, socket.AF_INET, socket.SOCK_STREAM)
        family, socktype, proto, _, sockaddr = addr_info[0]
        sock = socket.socket(family, socktype, proto)
        if timeout is not None:
            sock.settimeout(timeout)
        sock.connect(sockaddr)
        return sock


class IPv4EmailBackend(DjangoSMTPBackend):
    """Django SMTP email backend that connects over IPv4 only."""

    def open(self):
        if self.connection:
            return False
        try:
            self.connection = IPv4SMTP(self.host, self.port, timeout=self.timeout)
            if self.use_tls:
                self.connection.ehlo()
                self.connection.starttls()
                self.connection.ehlo()
            if self.username and self.password:
                self.connection.login(self.username, self.password)
            return True
        except Exception:
            if not self.fail_silently:
                raise
            return False