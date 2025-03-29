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
 * 
 * @export
 * @interface PostMedicationReminderPngRequest
 */
export interface PostMedicationReminderPngRequest {
    /**
     * 
     * @type {Blob}
     * @memberof PostMedicationReminderPngRequest
     */
    file: Blob;
}

/**
 * Check if a given object implements the PostMedicationReminderPngRequest interface.
 */
export function instanceOfPostMedicationReminderPngRequest(value: object): value is PostMedicationReminderPngRequest {
    if (!('file' in value) || value['file'] === undefined) return false;
    return true;
}

export function PostMedicationReminderPngRequestFromJSON(json: any): PostMedicationReminderPngRequest {
    return PostMedicationReminderPngRequestFromJSONTyped(json, false);
}

export function PostMedicationReminderPngRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PostMedicationReminderPngRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'file': json['file'],
    };
}

export function PostMedicationReminderPngRequestToJSON(json: any): PostMedicationReminderPngRequest {
    return PostMedicationReminderPngRequestToJSONTyped(json, false);
}

export function PostMedicationReminderPngRequestToJSONTyped(value?: PostMedicationReminderPngRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'file': value['file'],
    };
}

