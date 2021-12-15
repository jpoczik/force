/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowBannersRailRendererQueryVariables = {
    partnerId: string;
};
export type ShowBannersRailRendererQueryResponse = {
    readonly partner: {
        readonly " $fragmentRefs": FragmentRefs<"ShowBannersRail_partner">;
    } | null;
};
export type ShowBannersRailRendererQuery = {
    readonly response: ShowBannersRailRendererQueryResponse;
    readonly variables: ShowBannersRailRendererQueryVariables;
};



/*
query ShowBannersRailRendererQuery(
  $partnerId: String!
) {
  partner(id: $partnerId) @principalField {
    ...ShowBannersRail_partner
    id
  }
}

fragment ShowBanner_show on Show {
  slug
  name
  href
  isFairBooth
  exhibitionPeriod
  status
  description
  location {
    city
    id
  }
  coverImage {
    medium: cropped(width: 600, height: 480, version: ["normalized", "larger", "large"]) {
      src
      srcSet
    }
  }
}

fragment ShowBannersDesktopCarousel_shows on Show {
  id
  ...ShowBanner_show
}

fragment ShowBannersMobileCarousel_shows on Show {
  id
  ...ShowBanner_show
}

fragment ShowBannersRail_partner on Partner {
  slug
  featuredShow: showsConnection(first: 1, status: ALL, sort: FEATURED_DESC_END_AT_DESC, isDisplayable: true) {
    edges {
      node {
        id
        ...ShowBannersMobileCarousel_shows
        ...ShowBannersDesktopCarousel_shows
      }
    }
  }
  currentShows: showsConnection(first: 10, status: CURRENT, sort: END_AT_ASC, isDisplayable: true) {
    edges {
      node {
        id
        ...ShowBannersMobileCarousel_shows
        ...ShowBannersDesktopCarousel_shows
      }
    }
  }
  upcomingShows: showsConnection(first: 10, status: UPCOMING, sort: START_AT_ASC, isDisplayable: true) {
    edges {
      node {
        id
        ...ShowBannersMobileCarousel_shows
        ...ShowBannersDesktopCarousel_shows
      }
    }
  }
  pastShows: showsConnection(first: 2, status: CLOSED, sort: END_AT_DESC, isDisplayable: true) {
    edges {
      node {
        id
        ...ShowBannersMobileCarousel_shows
        ...ShowBannersDesktopCarousel_shows
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "partnerId",
    "type": "String!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "partnerId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "kind": "Literal",
  "name": "isDisplayable",
  "value": true
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ShowEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "href",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isFairBooth",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "exhibitionPeriod",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Location",
            "kind": "LinkedField",
            "name": "location",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "city",
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": [
              {
                "alias": "medium",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "height",
                    "value": 480
                  },
                  {
                    "kind": "Literal",
                    "name": "version",
                    "value": [
                      "normalized",
                      "larger",
                      "large"
                    ]
                  },
                  {
                    "kind": "Literal",
                    "name": "width",
                    "value": 600
                  }
                ],
                "concreteType": "CroppedImageUrl",
                "kind": "LinkedField",
                "name": "cropped",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "src",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "srcSet",
                    "storageKey": null
                  }
                ],
                "storageKey": "cropped(height:480,version:[\"normalized\",\"larger\",\"large\"],width:600)"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v6 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowBannersRailRendererQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ShowBannersRail_partner"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowBannersRailRendererQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": "featuredShow",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              },
              (v3/*: any*/),
              {
                "kind": "Literal",
                "name": "sort",
                "value": "FEATURED_DESC_END_AT_DESC"
              },
              {
                "kind": "Literal",
                "name": "status",
                "value": "ALL"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "showsConnection(first:1,isDisplayable:true,sort:\"FEATURED_DESC_END_AT_DESC\",status:\"ALL\")"
          },
          {
            "alias": "currentShows",
            "args": [
              (v6/*: any*/),
              (v3/*: any*/),
              {
                "kind": "Literal",
                "name": "sort",
                "value": "END_AT_ASC"
              },
              {
                "kind": "Literal",
                "name": "status",
                "value": "CURRENT"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "showsConnection(first:10,isDisplayable:true,sort:\"END_AT_ASC\",status:\"CURRENT\")"
          },
          {
            "alias": "upcomingShows",
            "args": [
              (v6/*: any*/),
              (v3/*: any*/),
              {
                "kind": "Literal",
                "name": "sort",
                "value": "START_AT_ASC"
              },
              {
                "kind": "Literal",
                "name": "status",
                "value": "UPCOMING"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "showsConnection(first:10,isDisplayable:true,sort:\"START_AT_ASC\",status:\"UPCOMING\")"
          },
          {
            "alias": "pastShows",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 2
              },
              (v3/*: any*/),
              {
                "kind": "Literal",
                "name": "sort",
                "value": "END_AT_DESC"
              },
              {
                "kind": "Literal",
                "name": "status",
                "value": "CLOSED"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "showsConnection(first:2,isDisplayable:true,sort:\"END_AT_DESC\",status:\"CLOSED\")"
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "ShowBannersRailRendererQuery",
    "operationKind": "query",
    "text": "query ShowBannersRailRendererQuery(\n  $partnerId: String!\n) {\n  partner(id: $partnerId) @principalField {\n    ...ShowBannersRail_partner\n    id\n  }\n}\n\nfragment ShowBanner_show on Show {\n  slug\n  name\n  href\n  isFairBooth\n  exhibitionPeriod\n  status\n  description\n  location {\n    city\n    id\n  }\n  coverImage {\n    medium: cropped(width: 600, height: 480, version: [\"normalized\", \"larger\", \"large\"]) {\n      src\n      srcSet\n    }\n  }\n}\n\nfragment ShowBannersDesktopCarousel_shows on Show {\n  id\n  ...ShowBanner_show\n}\n\nfragment ShowBannersMobileCarousel_shows on Show {\n  id\n  ...ShowBanner_show\n}\n\nfragment ShowBannersRail_partner on Partner {\n  slug\n  featuredShow: showsConnection(first: 1, status: ALL, sort: FEATURED_DESC_END_AT_DESC, isDisplayable: true) {\n    edges {\n      node {\n        id\n        ...ShowBannersMobileCarousel_shows\n        ...ShowBannersDesktopCarousel_shows\n      }\n    }\n  }\n  currentShows: showsConnection(first: 10, status: CURRENT, sort: END_AT_ASC, isDisplayable: true) {\n    edges {\n      node {\n        id\n        ...ShowBannersMobileCarousel_shows\n        ...ShowBannersDesktopCarousel_shows\n      }\n    }\n  }\n  upcomingShows: showsConnection(first: 10, status: UPCOMING, sort: START_AT_ASC, isDisplayable: true) {\n    edges {\n      node {\n        id\n        ...ShowBannersMobileCarousel_shows\n        ...ShowBannersDesktopCarousel_shows\n      }\n    }\n  }\n  pastShows: showsConnection(first: 2, status: CLOSED, sort: END_AT_DESC, isDisplayable: true) {\n    edges {\n      node {\n        id\n        ...ShowBannersMobileCarousel_shows\n        ...ShowBannersDesktopCarousel_shows\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'ed78181254cd76899a10d28072a86119';
export default node;
