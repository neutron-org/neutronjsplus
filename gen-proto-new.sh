#!/usr/bin/env bash

# generate neutron types

# TODO: change to use locally cloned neutron
# TODO: do we need --include-imports?
npx buf generate buf.build/protocolbuffers/wellknowntypes --include-imports --template ./buf.ts.gen.yaml --output ./src/generated/wellknowntypes
npx buf generate ../neutron/proto --include-imports --template ./buf.ts.gen.yaml --output ./src/generated/neutron
npx buf generate ../neutron/third_party/proto --include-imports --template ./buf.ts.gen.yaml --output ./src/generated/neutron_thirdparty
npx buf generate ../github.com/neutron-admin-module --include-imports --template ./buf.ts.gen.yaml --output ./src/generated/admin_module
npx buf generate ../github.com/block-sdk/proto --include-imports --template ./buf.ts.gen.yaml --output ./src/generated/block_sdk
npx buf generate ../neutron-cosmos-sdk/proto --include-imports --template ./buf.ts.gen.yaml --output ./src/generated/cosmos_sdk

# npx buf generate ./ibc-go/ # TODO

# generate ibc-go types
# cd ibc-go && git checkout -d 1 v7.3.1 && cd ../

# generate google types

# generate admin-module types

# generate pob types
git clone git@github.com:skip-mev/block-sdk.git
# gco v1.1.0
