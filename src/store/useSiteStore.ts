import { AtomAsset } from 'dumi-assets-types';
import {
  ILocalesConfig,
  INavItem,
  IPreviewerProps,
  IRouteMeta,
  ISidebarGroup,
  IThemeConfig,
} from 'dumi/dist/client/theme-api/types';
import { PICKED_PKG_FIELDS } from 'dumi/dist/constants';
import type { Location } from 'history';

import { ComponentType } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Feature } from '../components/Features';

export type NavData = (INavItem & { children?: INavItem[] | undefined })[];

export interface SiteState {
  pkg: Partial<Record<keyof typeof PICKED_PKG_FIELDS, any>>;
  entryExports: Record<string, any>;
  demos: Record<
    string,
    {
      component: ComponentType;
      asset: IPreviewerProps['asset'];
      routeId: string;
    }
  >;

  components: Record<string, AtomAsset>;
  locales: ILocalesConfig;
  themeConfig: IThemeConfig;
  loading: boolean;
  setLoading: (status: boolean) => void;
}

interface Store {
  siteData: SiteState;
  sidebar: ISidebarGroup[];
  routeMeta: IRouteMeta;
  navData: NavData;
  location: Location;
}

const initialState: Store = {
  siteData: {
    // @ts-ignore
    setLoading: undefined,
    loading: true,
    pkg: {},
    components: {},
    demos: {},
    locales: [],
    entryExports: {},
    // @ts-ignore
    themeConfig: {},
  },
  sidebar: [],
  navData: [],

  location: {
    pathname: '',
    state: '',
    search: '',
    hash: '',
    key: '',
  },

  routeMeta: {
    toc: [],
    texts: [],
    tabs: undefined,
    // @ts-ignore
    frontmatter: {},
  },
};

export const useSiteStore = create<Store>()(
  devtools(
    () => ({
      ...initialState,
    }),
    { name: 'dumi-theme-antd-style' },
  ),
);

export const isApiPageSel = (s: Store) => s.location.pathname.startsWith('/api');
export const isHeroPageSel = (s: Store) => !!s.routeMeta.frontmatter.hero;

/**
 * Title 选择器
 * 选择逻辑：如果是 hero 页面，使用 hero 配置的 title，否则使用 siteData 中的 title
 * @param s
 */
export const titleSel = (s: Store) =>
  s.siteData.themeConfig.title || s.routeMeta.frontmatter.hero?.title;

/**
 * Features 选择器
 */
export const featuresSel = (s: Store): Feature[] =>
  isHeroPageSel(s) && s.siteData.themeConfig.features;

export const activePathSel = (s: Store) => {
  if (s.location.pathname === '/') return '/';

  const item = s.navData
    .filter((i) => i.link !== '/')
    .find((i) => s.location.pathname.startsWith(i.activePath!));

  return item?.activePath || '';
};
