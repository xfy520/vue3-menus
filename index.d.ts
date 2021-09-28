type elementIconType = import('vue').DefineComponent<{}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin,
    import('vue').ComponentOptionsMixin, import('vue').EmitsOptions, string,
    import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, Readonly<{} & {} & {}>, {}>;

type antdvIconType = import('vue').FunctionalComponent;

type menusItemType<I = string | elementIconType | antdvIconType> = {
  label: string;
  icon?: I | {
    node: I,
    option?: {
      [key: string]: unknown
    }
  };
  disabled?: boolean;
  divided?: boolean;
  click?: (...arg: unknown[]) => unknown;
  children?: Array<menusItemType>;
  tip?: string;
  hidden?: boolean;
  style?: {
    [key: string]: string | number
  }
}

type baseType<I = string | elementIconType | antdvIconType> = {
  menus: Array<menusItemType<I>>;
  menusStyle?: {
    [key: string]: unknown
  };
  menusItemClass?: string;
  minWidth?: number | string;
  maxWidth?: number | string;
  zIndex?: number | string;
}

type menusType<I = string | elementIconType | antdvIconType> = {
    event: MouseEvent;
} & baseType<I> | {
  position: {
    x: number,
    y: number
  };
} & baseType<I> | {
  event?: MouseEvent;
  position?: {
    x: number,
    y: number
  };
} & baseType<I>

declare module 'vue3-menus' {
  export const Vue3Menus: import('vue').DefineComponent<menusType & {
    open: boolean
  }>;

  export const menusEvent: (event: MouseEvent, menus: menusType) => import('vue').ComponentPublicInstance;

  export const directive: import('vue').Directive;

  const install: (app: import('vue').App, options: {
    name: string
  }) => unknown;
  export default install;
}
