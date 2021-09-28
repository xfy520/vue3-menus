import { install, directive, Vue3Menus, menusEvent } from './components'

export default function(app){
  app.use(install)
}

export {
  directive, Vue3Menus, menusEvent
}
