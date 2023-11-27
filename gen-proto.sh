#!/usr/bin/env bash

ROOT=$(pwd)
IN="./tmp"
OUT="./src/generated"
TEMPLATE="./buf.ts.gen.yaml"

mkdir $IN

# ===== base types ============
npx buf generate buf.build/protocolbuffers/wellknowntypes --template $TEMPLATE --output $OUT/wellknowntypes

# ===== neutron ===============
git clone https://github.com/neutron-org/neutron $IN/neutron
cd $IN/neutron
# TODO: checkout the new sdk47 version
git checkout -d 1 update-sdk47
cd $ROOT
npx buf generate $IN/neutron/proto --template $TEMPLATE --output $OUT/neutron
npx buf generate $IN/neutron/third_party/proto --template $TEMPLATE --output $OUT/neutron_thirdparty

# ===== neutron admin-module ==
git clone https://github.com/neutron-org/admin-module $IN/admin-module
cd $IN/admin-module
git checkout v1.0.0 -d 1
cd $ROOT
npx buf generate $IN/admin-module/proto --template $TEMPLATE --output $OUT/admin_module

# ===== neutron cosmos-sdk ====
git clone github.com/neutron-org/cosmos-sdk $IN/cosmos-sdk
cd $IN/cosmos-sdk
git checkout -d 1 v0.47.6-neutron
cd $ROOT
npx buf generate $IN/cosmos-sdk/proto --template $TEMPLATE --output $OUT/cosmos_sdk

# ===== ibc-go ================
git clone github.com/cosmos/ibc-go $IN/ibc-go
cd $IN/ibc-go
git checkout -d 1 v7.3.1
cd $ROOT
npx buf generate $IN/ibc-go/proto --template $TEMPLATE --output $OUT/ibc_go

# note: commented because we don't have pob for now
# ===== block-sdk (pob) =======
# git clone git@github.com:skip-mev/block-sdk.git
# cd $IN/block-sdk
# git checkout -d 1 v1.1.0
# cd $ROOT
# npx buf generate $IN/block-sdk/proto --template $TEMPLATE --output $OUT/block_sdk

rm -rf $IN
