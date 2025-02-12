/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeatureFeaturedLink_featuredLink = {
    readonly href: string | null;
    readonly title: string | null;
    readonly subtitle: string | null;
    readonly description: string | null;
    readonly image: {
        readonly small: {
            readonly src: string;
            readonly srcSet: string;
            readonly width: number;
            readonly height: number;
        } | null;
        readonly medium: {
            readonly src: string;
            readonly srcSet: string;
            readonly width: number;
            readonly height: number;
        } | null;
        readonly large: {
            readonly src: string;
            readonly srcSet: string;
            readonly width: number;
            readonly height: number;
        } | null;
        readonly full: {
            readonly src: string;
            readonly srcSet: string;
            readonly width: number | null;
            readonly height: number | null;
        } | null;
    } | null;
    readonly " $refType": "FeatureFeaturedLink_featuredLink";
};
export type FeatureFeaturedLink_featuredLink$data = FeatureFeaturedLink_featuredLink;
export type FeatureFeaturedLink_featuredLink$key = {
    readonly " $data"?: FeatureFeaturedLink_featuredLink$data;
    readonly " $fragmentRefs": FragmentRefs<"FeatureFeaturedLink_featuredLink">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "version",
  "value": [
    "main",
    "wide"
  ]
},
v1 = [
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
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "width",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "height",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeatureFeaturedLink_featuredLink",
  "selections": [
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
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "format",
          "value": "PLAIN"
        }
      ],
      "kind": "ScalarField",
      "name": "subtitle",
      "storageKey": "subtitle(format:\"PLAIN\")"
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "format",
          "value": "HTML"
        }
      ],
      "kind": "ScalarField",
      "name": "description",
      "storageKey": "description(format:\"HTML\")"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": "small",
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 240
            },
            (v0/*: any*/),
            {
              "kind": "Literal",
              "name": "width",
              "value": 335
            }
          ],
          "concreteType": "CroppedImageUrl",
          "kind": "LinkedField",
          "name": "cropped",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": "cropped(height:240,version:[\"main\",\"wide\"],width:335)"
        },
        {
          "alias": "medium",
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 324
            },
            (v0/*: any*/),
            {
              "kind": "Literal",
              "name": "width",
              "value": 452
            }
          ],
          "concreteType": "CroppedImageUrl",
          "kind": "LinkedField",
          "name": "cropped",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": "cropped(height:324,version:[\"main\",\"wide\"],width:452)"
        },
        {
          "alias": "large",
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 648
            },
            (v0/*: any*/),
            {
              "kind": "Literal",
              "name": "width",
              "value": 904
            }
          ],
          "concreteType": "CroppedImageUrl",
          "kind": "LinkedField",
          "name": "cropped",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": "cropped(height:648,version:[\"main\",\"wide\"],width:904)"
        },
        {
          "alias": "full",
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 777
            },
            (v0/*: any*/),
            {
              "kind": "Literal",
              "name": "width",
              "value": 1085
            }
          ],
          "concreteType": "ResizedImageUrl",
          "kind": "LinkedField",
          "name": "resized",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": "resized(height:777,version:[\"main\",\"wide\"],width:1085)"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "FeaturedLink",
  "abstractKey": null
};
})();
(node as any).hash = '80c4cca0a36a443e6ac6394d2cfd9be9';
export default node;
