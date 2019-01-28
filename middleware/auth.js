import routeOption from '@/auth/auth.utilities';
import userRoles from '@/auth/auth.roles';

export default function(ctx) {
  if (routeOption(ctx.route, 'auth', false)) {
    return;
  }

  const { login } = ctx.app.$auth.options.redirect;

  if (ctx.app.$auth.state.loggedIn) {
    if (login && ctx.route.path === login.split('?')[0]) {
      ctx.app.$auth.redirect('home');
    } else {
      if (
        userRoles.indexOf(ctx.route.meta[0].guard) >
        userRoles.indexOf(ctx.store.state.auth.user.role)
      ) {
        ctx.app.$auth.redirect('guard');
      }
    }
  } else {
    ctx.app.$auth.redirect('home');
  }
}
