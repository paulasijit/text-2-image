from flask_login import UserMixin


class User(UserMixin):
    def __init__(
        self,
        id,
        email,
        password,
    ):
        self.id = id
        self.email = email
        self.password = password

    def is_active(self):
        return self.is_active()

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return self.authenticated
