class User {
  name: string;
  surname: string;
  email: string;
  password: string;
  is_confirmed: boolean;
  middlename?: string;
  username?: string;

  constructor(
    name: string,
    surname: string,
    email: string,
    password: string,
    is_confirmed: boolean = false,
    middlename?: string,
    username?: string
  ) {
    this.name = name;
    this.surname = surname;
    this.middlename = middlename;
    this.email = email;
    this.username = username;
    this.password = password;
    this.is_confirmed = is_confirmed;
  }
}

export { User };
