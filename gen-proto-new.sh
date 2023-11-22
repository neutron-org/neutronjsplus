#!/usr/bin/env bash

# generate neutron types

# TODO: change to use locally cloned neutron
# TODO: do we need --include-imports?
npx buf generate buf.build/protocolbuffers/wellknowntypes --include-imports --template ./buf.ts.gen.yaml --output ./src/generated/wellknowntypes
npx buf generate ../neutron/proto --include-imports --template ./buf.ts.gen.yaml --output ./src/generated/neutron
npx buf generate ../neutron/third_party/proto --include-imports --template ./buf.ts.gen.yaml --output ./src/generated/neutron_thirdparty
# npx buf generate ./ibc-go/ # TODO

# generate ibc-go types
# cd ibc-go && git checkout -d 1 v7.3.1 && cd ../

# generate google types

# generate admin-module types
