import "@mui/material/styles";

interface CustomColor {
  main: string;
}

declare module "@mui/material/styles" {
  interface Palette {
    profile: CustomColor;
    budget: CustomColor;
    saving: CustomColor;
    card: CustomColor;
    right: CustomColor;
    list: CustomColor;
    icon: CustomColor;
    indicator: CustomColor;
    border: CustomColor;
    select: CustomColor;
    tablecell: CustomColor;
    favlist: CustomColor;
    pagination: CustomColor;
    savetext: CustomColor;
    selected: CustomColor;
    pr: CustomColor;
    left: CustomColor;
    even: CustomColor;
    uneven: CustomColor;
    iconlist: { default: string };
    nav: CustomColor;
    navbar: CustomColor;
    table: CustomColor;
    tablehead: CustomColor;
    tabletext: CustomColor;
    selectBackground: CustomColor;
    monthly: CustomColor;
    task: CustomColor;
    total: CustomColor;
    favorites: CustomColor;
    head: CustomColor;
    content: CustomColor;
    add: CustomColor;
  }

  interface PaletteOptions {
    profile?: CustomColor;
    budget?: CustomColor;
    saving?: CustomColor;
    card?: CustomColor;
    right?: CustomColor;
    list?: CustomColor;
    icon?: CustomColor;
    indicator?: CustomColor;
    border?: CustomColor;
    select?: CustomColor;
    tablecell?: CustomColor;
    favlist?: CustomColor;
    pagination?: CustomColor;
    savetext?: CustomColor;
    selected?: CustomColor;
    pr?: CustomColor;
    left?: CustomColor;
    even?: CustomColor;
    uneven?: CustomColor;
    iconlist?: { default: string };
    nav?: CustomColor;
    navbar?: CustomColor;
    table?: CustomColor;
    tablehead?: CustomColor;
    tabletext?: CustomColor;
    selectBackground?: CustomColor;
    monthly?: CustomColor;
    task?: CustomColor;
    total?: CustomColor;
    favorites?: CustomColor;
    head?: CustomColor;
    content?: CustomColor;
    add?: CustomColor;
  }

  interface TypeText {
    main: string;
  }
}
