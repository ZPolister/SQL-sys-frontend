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

import type {OrderItem} from './OrderItem';
import {OrderItemFromJSON, OrderItemToJSON,} from './OrderItem';

/**
 *
 * @export
 * @interface PageObject
 */
export interface PageObject {
  /**
   *
   * @type {Array<object>}
   * @memberof PageObject
   */
  records?: Array<object>;
  /**
   *
   * @type {number}
   * @memberof PageObject
   */
  total?: number;
  /**
   *
   * @type {number}
   * @memberof PageObject
   */
  size?: number;
  /**
   *
   * @type {number}
   * @memberof PageObject
   */
  current?: number;
  /**
   *
   * @type {Array<OrderItem>}
   * @memberof PageObject
   */
  orders?: Array<OrderItem>;
  /**
   *
   * @type {PageObject}
   * @memberof PageObject
   */
  optimizeCountSql?: PageObject;
  /**
   *
   * @type {PageObject}
   * @memberof PageObject
   */
  searchCount?: PageObject;
  /**
   *
   * @type {boolean}
   * @memberof PageObject
   */
  optimizeJoinOfCountSql?: boolean;
  /**
   *
   * @type {number}
   * @memberof PageObject
   */
  maxLimit?: number;
  /**
   *
   * @type {string}
   * @memberof PageObject
   */
  countId?: string;
  /**
   *
   * @type {number}
   * @memberof PageObject
   * @deprecated
   */
  pages?: number;
}

/**
 * Check if a given object implements the PageObject interface.
 */
export function instanceOfPageObject(value: object): value is PageObject {
  return true;
}

export function PageObjectFromJSON(json: any): PageObject {
  return PageObjectFromJSONTyped(json, false);
}

export function PageObjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageObject {
  if (json == null) {
    return json;
  }
  return {

    'records': json['records'] == null ? undefined : json['records'],
    'total': json['total'] == null ? undefined : json['total'],
    'size': json['size'] == null ? undefined : json['size'],
    'current': json['current'] == null ? undefined : json['current'],
    'orders': json['orders'] == null ? undefined : ((json['orders'] as Array<any>).map(OrderItemFromJSON)),
    'optimizeCountSql': json['optimizeCountSql'] == null ? undefined : PageObjectFromJSON(json['optimizeCountSql']),
    'searchCount': json['searchCount'] == null ? undefined : PageObjectFromJSON(json['searchCount']),
    'optimizeJoinOfCountSql': json['optimizeJoinOfCountSql'] == null ? undefined : json['optimizeJoinOfCountSql'],
    'maxLimit': json['maxLimit'] == null ? undefined : json['maxLimit'],
    'countId': json['countId'] == null ? undefined : json['countId'],
    'pages': json['pages'] == null ? undefined : json['pages'],
  };
}

export function PageObjectToJSON(json: any): PageObject {
  return PageObjectToJSONTyped(json, false);
}

export function PageObjectToJSONTyped(value?: PageObject | null, ignoreDiscriminator: boolean = false): any {
  if (value == null) {
    return value;
  }

  return {

    'records': value['records'],
    'total': value['total'],
    'size': value['size'],
    'current': value['current'],
    'orders': value['orders'] == null ? undefined : ((value['orders'] as Array<any>).map(OrderItemToJSON)),
    'optimizeCountSql': PageObjectToJSON(value['optimizeCountSql']),
    'searchCount': PageObjectToJSON(value['searchCount']),
    'optimizeJoinOfCountSql': value['optimizeJoinOfCountSql'],
    'maxLimit': value['maxLimit'],
    'countId': value['countId'],
    'pages': value['pages'],
  };
}

