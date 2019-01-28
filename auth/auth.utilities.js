// prettier-ignore
export default function (route, key, value) {
  route.matched.some((m) => {
    if (process.browser) {
      return Object.values(m.components).some(
        component => component.options[key] === value,
      );
    }
    return false;
  });
}
