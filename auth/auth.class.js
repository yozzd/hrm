import Vue from 'vue';
import Cookies from 'js-cookie';
import routeOption from './auth.utilities';
import AUTH from '../apollo/queries/login';
import { ME } from '../apollo/queries/user';
import userRoles from './auth.roles';

const RELATIVE_URL_REGEX = /^\/[a-zA-Z0-9@\-%_~][a-zA-Z0-9@\-%_~]{1,200}$/;

export default class Auth {
  constructor(ctx) {
    this.ctx = ctx;
    this.apolloClient = this.ctx.app.apolloProvider.defaultClient;
    this.Cookies = Cookies;

    this.options = {
      namespace: 'auth',
      redirect: {
        login: '/login',
        home: '/',
        dashboard: '/dashboard',
        logout: '/',
        guard: '/guard',
      },
    };
  }

  init() {
    Vue.set(this, 'token', null);

    this.registerVuexStore();

    this.watchLoggedIn();

    this.syncToken();
    return this.state.user ? Promise.resolve() : this.fetchUser();
  }

  registerVuexStore() {
    const authModule = {
      namespaced: true,
      state: () => ({
        user: null,
        loggedIn: false,
      }),
      mutations: {
        SET(state, payload) {
          Vue.set(state, payload.key, payload.value);
        },
      },
    };

    this.$store.registerModule(this.options.namespace, authModule, {
      preserveState: Boolean(this.$store.state[this.options.namespace]),
    });
  }

  watchLoggedIn() {
    this.loggedInWatcher = this.watchState('loggedIn', () => {
      const { loggedIn } = this.state;
      if (routeOption(this.$route, 'auth', false)) {
        return;
      }
      if (loggedIn) {
        this.redirect('dashboard');
      } else {
        this.redirect('home');
      }
    });
  }

  // prettier-ignore
  watchState(key, fn) {
    return this.$store.watch(
      state => [state[this.options.namespace]].map(v => v[key]),
      fn,
    );
  }

  get $store() {
    return this.ctx.store;
  }

  get $route() {
    return this.ctx.route;
  }

  get state() {
    return this.$store.state[this.options.namespace];
  }

  setState(key, value) {
    if (key === 'token') {
      this.token = value;
      return;
    }

    this.$store.commit(`${this.options.namespace}/SET`, { key, value });
  }

  setToken(token) {
    this.setState('token', token);

    this.setCookie(token);
  }

  setCookie(token) {
    if (token) {
      this.Cookies.set('token', token);
    } else {
      this.Cookies.remove('token');
    }
  }

  reset() {
    this.setState('loggedIn', false);
    this.setState('token', null);
    this.setState('user', null);

    this.setCookie(null);
  }

  async fetchUser() {
    try {
      const { data } = await this.apolloClient.query({
        query: ME,
      });

      if (!data.userMe) {
        return;
      }

      this.setState('user', data.userMe);
      this.setState('loggedIn', true);
    } catch (err) {
      this.logout();
    }
  }

  async login(user) {
    try {
      this.reset();

      const { data } = await this.apolloClient.query({
        query: AUTH,
        variables: {
          username: user.username,
          password: user.password,
        },
      });

      if (!data.auth) {
        return;
      }

      this.setToken(data.auth.token);

      this.setState('user', data.auth.user);
      this.setState('loggedIn', true);
    } catch (err) {
      throw err;
    }
  }

  async logout() {
    this.reset();
  }

  syncToken() {
    let token = this.getState('token');

    if (!token) {
      token = this.getCookie('token');
    }

    this.setToken(token);
  }

  getState(key) {
    if (key === 'token') {
      return this.token;
    }

    return this.state[key];
  }

  getCookie(name) {
    return this.Cookies.get(name);
  }

  redirect(name) {
    let to = this.options.redirect[name];
    const from = this.$route.path;

    if (!to) {
      return;
    }

    if (name === 'login') {
      to = `${to}?redirect=${encodeURIComponent(from)}`;
    }

    if (name === 'home' && this.$route.query.redirect) {
      const redirect = decodeURIComponent(this.$route.query.redirect);

      if (RELATIVE_URL_REGEX.test(redirect)) {
        to = redirect;
      }
    }

    if (to.split('?')[0] === from) {
      return;
    }

    this.ctx.redirect(to);
  }

  hasRole(role) {
    if (!this.state.user) {
      return false;
    }
    return Boolean(
      userRoles.indexOf(this.state.user.role) >= userRoles.indexOf(role),
    );
  }

  isAdmin() {
    if (!this.state.user) {
      return false;
    }
    const is = this.state.user.role === 'admin';
    return is;
  }
}
