/* tslint:disable */
/* eslint-disable */
/**
 * TTXX健康
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface GetApiAuthCheckLogin200Response
 */
export interface GetApiAuthCheckLogin200Response {
  /**
   *
   * @type {number}
   * @memberof GetApiAuthCheckLogin200Response
   */
  code: number;
  /**
   *
   * @type {string}
   * @memberof GetApiAuthCheckLogin200Response
   */
  msg: string;
  /**
   *
   * @type {boolean}
   * @memberof GetApiAuthCheckLogin200Response
   */
  data: boolean;
}

/**
 * Check if a given object implements the GetApiAuthCheckLogin200Response interface.
 */
export function instanceOfGetApiAuthCheckLogin200Response(value: object): value is GetApiAuthCheckLogin200Response {
  if (!('code' in value) || value['code'] === undefined) return false;
  if (!('msg' in value) || value['msg'] === undefined) return false;
  if (!('data' in value) || value['data'] === undefined) return false;
  return true;
}

export function GetApiAuthCheckLogin200ResponseFromJSON(json: any): GetApiAuthCheckLogin200Response {
  return GetApiAuthCheckLogin200ResponseFromJSONTyped(json, false);
}

export function GetApiAuthCheckLogin200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetApiAuthCheckLogin200Response {
  if (json == null) {
    return json;
  }
  return {

    'code': json['code'],
    'msg': json['msg'],
    'data': json['data'],
  };
}

export function GetApiAuthCheckLogin200ResponseToJSON(json: any): GetApiAuthCheckLogin200Response {
  return GetApiAuthCheckLogin200ResponseToJSONTyped(json, false);
}

export function GetApiAuthCheckLogin200ResponseToJSONTyped(value?: GetApiAuthCheckLogin200Response | null, ignoreDiscriminator: boolean = false): any {
  if (value == null) {
    return value;
  }

  return {

    'code': value['code'],
    'msg': value['msg'],
    'data': value['data'],
  };
}

