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
import type { SleepLog } from './SleepLog';
import {
    SleepLogFromJSON,
    SleepLogFromJSONTyped,
    SleepLogToJSON,
    SleepLogToJSONTyped,
} from './SleepLog';
import type { OrderItem } from './OrderItem';
import {
    OrderItemFromJSON,
    OrderItemFromJSONTyped,
    OrderItemToJSON,
    OrderItemToJSONTyped,
} from './OrderItem';

/**
 * 响应数据
 * @export
 * @interface PageSleepLog
 */
export interface PageSleepLog {
    /**
     * 
     * @type {Array<SleepLog>}
     * @memberof PageSleepLog
     */
    records?: Array<SleepLog>;
    /**
     * 
     * @type {number}
     * @memberof PageSleepLog
     */
    total?: number;
    /**
     * 
     * @type {number}
     * @memberof PageSleepLog
     */
    size?: number;
    /**
     * 
     * @type {number}
     * @memberof PageSleepLog
     */
    current?: number;
    /**
     * 
     * @type {Array<OrderItem>}
     * @memberof PageSleepLog
     */
    orders?: Array<OrderItem>;
    /**
     * 
     * @type {PageSleepLog}
     * @memberof PageSleepLog
     */
    optimizeCountSql?: PageSleepLog;
    /**
     * 
     * @type {PageSleepLog}
     * @memberof PageSleepLog
     */
    searchCount?: PageSleepLog;
    /**
     * 
     * @type {boolean}
     * @memberof PageSleepLog
     */
    optimizeJoinOfCountSql?: boolean;
    /**
     * 
     * @type {number}
     * @memberof PageSleepLog
     */
    maxLimit?: number;
    /**
     * 
     * @type {string}
     * @memberof PageSleepLog
     */
    countId?: string;
    /**
     * 
     * @type {number}
     * @memberof PageSleepLog
     * @deprecated
     */
    pages?: number;
}

/**
 * Check if a given object implements the PageSleepLog interface.
 */
export function instanceOfPageSleepLog(value: object): value is PageSleepLog {
    return true;
}

export function PageSleepLogFromJSON(json: any): PageSleepLog {
    return PageSleepLogFromJSONTyped(json, false);
}

export function PageSleepLogFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageSleepLog {
    if (json == null) {
        return json;
    }
    return {
        
        'records': json['records'] == null ? undefined : ((json['records'] as Array<any>).map(SleepLogFromJSON)),
        'total': json['total'] == null ? undefined : json['total'],
        'size': json['size'] == null ? undefined : json['size'],
        'current': json['current'] == null ? undefined : json['current'],
        'orders': json['orders'] == null ? undefined : ((json['orders'] as Array<any>).map(OrderItemFromJSON)),
        'optimizeCountSql': json['optimizeCountSql'] == null ? undefined : PageSleepLogFromJSON(json['optimizeCountSql']),
        'searchCount': json['searchCount'] == null ? undefined : PageSleepLogFromJSON(json['searchCount']),
        'optimizeJoinOfCountSql': json['optimizeJoinOfCountSql'] == null ? undefined : json['optimizeJoinOfCountSql'],
        'maxLimit': json['maxLimit'] == null ? undefined : json['maxLimit'],
        'countId': json['countId'] == null ? undefined : json['countId'],
        'pages': json['pages'] == null ? undefined : json['pages'],
    };
}

export function PageSleepLogToJSON(json: any): PageSleepLog {
    return PageSleepLogToJSONTyped(json, false);
}

export function PageSleepLogToJSONTyped(value?: PageSleepLog | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'records': value['records'] == null ? undefined : ((value['records'] as Array<any>).map(SleepLogToJSON)),
        'total': value['total'],
        'size': value['size'],
        'current': value['current'],
        'orders': value['orders'] == null ? undefined : ((value['orders'] as Array<any>).map(OrderItemToJSON)),
        'optimizeCountSql': PageSleepLogToJSON(value['optimizeCountSql']),
        'searchCount': PageSleepLogToJSON(value['searchCount']),
        'optimizeJoinOfCountSql': value['optimizeJoinOfCountSql'],
        'maxLimit': value['maxLimit'],
        'countId': value['countId'],
        'pages': value['pages'],
    };
}

