declare module "vue-easytable" {
  import { DefineComponent } from "vue";
  export const VeTable: DefineComponent<{}, {}, any>;
  export const VePagination: DefineComponent<{}, {}, any>;
  export const VeIcon: DefineComponent<{}, {}, any>;
  export const VeLoading: DefineComponent<{}, {}, any>;
  export const VeLocale: {
    use: (locale: string) => void;
  };
}
