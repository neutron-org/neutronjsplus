#!/usr/bin/env bash

ROOT=$(pwd)
IN="./tmp"
OUT="./src/proto"
TEMPLATE="./buf.ts.gen.yaml"

mkdir $IN

# ===== base types ============
npx buf generate buf.build/protocolbuffers/wellknowntypes --template $TEMPLATE --output $OUT/wellknowntypes

# ===== neutron ===============
git clone https://github.com/neutron-org/neutron $IN/neutron --branch update-sdk47 --depth 1 # TODO: checkout to new version tag
npx buf generate $IN/neutron/proto --template $TEMPLATE --output $OUT/neutron
npx buf generate $IN/neutron/third_party/proto --template $TEMPLATE --output $OUT/neutron_thirdparty

# ===== neutron admin-module ==
git clone https://github.com/neutron-org/admin-module $IN/admin-module --branch v1.0.0 --depth 1
npx buf generate $IN/admin-module/proto --template $TEMPLATE --output $OUT/admin_module

# ===== neutron cosmos-sdk ====
git clone https://github.com/neutron-org/cosmos-sdk $IN/cosmos-sdk --branch v0.47.6-neutron
cd $IN/cosmos-sdk
# git checkout v0.47.6-neutron
cd $ROOT
npx buf generate $IN/cosmos-sdk/proto --template $TEMPLATE --output $OUT/cosmos_sdk

# ===== ibc-go ================
git clone https://github.com/cosmos/ibc-go $IN/ibc-go --branch v7.3.1 --depth 1
npx buf generate $IN/ibc-go/proto --template $TEMPLATE --output $OUT/ibc_go

# note: commented because we don't have pob for now
# ===== block-sdk (pob) =======
# git clone git@github.com:skip-mev/block-sdk.git --branch v1.1.0 --depth 1
# npx buf generate $IN/block-sdk/proto --template $TEMPLATE --output $OUT/block_sdk

rm -rf $IN
