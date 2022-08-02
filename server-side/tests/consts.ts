// import { PapiClientOptions } from '@pepperi-addons/papi-sdk';

import { expect } from "chai";

export const mockClient/*: PapiClientOptions*/ = {
    AddonUUID: 'NotUsed',
    BaseURL: 'NotUsed',
    AddonSecretKey: 'NotUsed',
    ActionUUID: 'NotUsed',
    AssetsBaseUrl: 'NotUsed',
    Retry: () => { return 'NotUsed' },
    // Token is fake, only has distributor UUID which is mendatory for constructors
    OAuthAccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXBwZXJpLmRpc3RyaWJ1dG9ydXVpZCI6IjEyMzQ1Njc4OTAifQ.JcRiubA-ZGJsCJfDfU8eQqyZq8FAULgeLbXfm3-aQhs',
    ValidatePermission(policyName) {
        return Promise.resolve();
    }
}

export function validateArraysHaveSameObjects(fields: string[] | undefined, arg1: any) {
    expect(fields?.every(field => arg1.includes(field))).to.be.true;
    expect(arg1.every(field => fields?.includes(field))).to.be.true;
}