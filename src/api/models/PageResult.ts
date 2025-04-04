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

import { mapValues } from '../runtime';
/**
 * 分页查询结果
 * @export
 * @interface PageResult
 */
export interface PageResult {
    /**
     * 当前页码
     * @type {number}
     * @memberof PageResult
     */
    current?: number;
    /**
     * 每页大小
     * @type {number}
     * @memberof PageResult
     */
    size?: number;
    /**
     * 总记录数
     * @type {number}
     * @memberof PageResult
     */
    total?: number;
    /**
     * 总页数
     * @type {number}
     * @memberof PageResult
     */
    pages?: number;
    /**
     * 当前页数据
     * @type {Array<object>}
     * @memberof PageResult
     */
    records?: Array<object>;
}

/**
 * Check if a given object implements the PageResult interface.
 */
export function instanceOfPageResult(value: object): value is PageResult {
    return true;
}

export function PageResultFromJSON(json: any): PageResult {
    return PageResultFromJSONTyped(json, false);
}

export function PageResultFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageResult {
    if (json == null) {
        return json;
    }
    return {
        
        'current': json['current'] == null ? undefined : json['current'],
        'size': json['size'] == null ? undefined : json['size'],
        'total': json['total'] == null ? undefined : json['total'],
        'pages': json['pages'] == null ? undefined : json['pages'],
        'records': json['records'] == null ? undefined : json['records'],
    };
}

export function PageResultToJSON(json: any): PageResult {
    return PageResultToJSONTyped(json, false);
}

export function PageResultToJSONTyped(value?: PageResult | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'current': value['current'],
        'size': value['size'],
        'total': value['total'],
        'pages': value['pages'],
        'records': value['records'],
    };
}

