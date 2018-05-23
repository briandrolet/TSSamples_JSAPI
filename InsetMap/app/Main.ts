/*
  Copyright 2017 Esri

  Licensed under the Apache License, Version 2.0 (the "License");

  you may not use this file except in compliance with the License.

  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software

  distributed under the License is distributed on an "AS IS" BASIS,

  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

  See the License for the specific language governing permissions and

  limitations under the License.​
*/

import ApplicationBase = require("ApplicationBase/ApplicationBase");

import i18n = require("dojo/i18n!./nls/resources");

const CSS = {
  loading: "configurable-application--loading"
};
//import { syncSetup, createInsetView, addInsetWidgets } from "./sceneUtils";
import InsetMap from "./InsetMap";
import {
  createMapFromItem,
  createView,
  getConfigViewProperties,
  getItemTitle,
  findQuery,
  goToMarker,
  createWebMapFromItem
} from "ApplicationBase/support/itemUtils";

import {
  setPageLocale,
  setPageDirection,
  setPageTitle
} from "ApplicationBase/support/domHelper";

import {
  ApplicationConfig,
  ApplicationBaseSettings
} from "ApplicationBase/interfaces";

class SceneExample {
  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  ApplicationBase
  //----------------------------------
  base: ApplicationBase = null;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  public init(base: ApplicationBase): void {
    if (!base) {
      console.error("ApplicationBase is not defined");
      return;
    }

    setPageLocale(base.locale);
    setPageDirection(base.direction);

    this.base = base;

    const { config, results, settings } = base;
    const { find, marker } = config;
    const { webSceneItems } = results;

    const validWebSceneItems = webSceneItems.map(response => {
      return response.value;
    });

    const firstItem = validWebSceneItems[0];
    if (!firstItem) {
      console.error("Could not load an item to display");
      return;
    }

    config.title = !config.title ? getItemTitle(firstItem) : "";
    setPageTitle(config.title);

    const portalItem: any = this.base.results.applicationItem.value;
    const appProxies =
      portalItem && portalItem.appProxies ? portalItem.appProxies : null;

    const viewContainerNode = document.getElementById("viewContainer");
    if (this.base.config.splitDirection === "vertical") {
      // vertical is maps stacked vertically. Horizontal is side by side
      viewContainerNode.classList.add("direction-vertical");
    }
    const defaultViewProperties = getConfigViewProperties(config);
    const item = firstItem;

    const container = {
      container: document.getElementById("map3d")//viewNode
    };

    const viewProperties = {
      ...defaultViewProperties,
      ...container
    };

    const { basemapUrl, basemapReferenceUrl } = config;
    createMapFromItem({ item, appProxies }).then(map =>
      createView({
        ...viewProperties,
        map
      }).then(view => {
        view.when(async () => {
          const insetMap = new InsetMap({ mainView: view, config: this.base.config });
          insetMap.createInsetView();

        });
        findQuery(find, view).then(() => goToMarker(marker, view));
      })
    );

    document.body.classList.remove(CSS.loading);
  }
}

export = SceneExample;
