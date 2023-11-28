#!/usr/bin/env bash

ROOT=$(pwd)
REPOS="./tmp"
OUT="./src/proto"
TEMPLATE="./buf.ts.gen.yaml"

mkdir $REPOS

# ===== base types ============
npx buf generate buf.build/protocolbuffers/wellknowntypes --template $TEMPLATE --output $OUT/wellknowntypes

# ===== neutron ===============
git clone https://github.com/neutron-org/neutron $REPOS/neutron --branch v2.0.0 --depth 1
npx buf generate $REPOS/neutron/proto --template $TEMPLATE --output $OUT/neutron
npx buf generate $REPOS/neutron/third_party/proto --template $TEMPLATE --output $OUT/neutron_thirdparty

# ===== admin-module ==========
git clone https://github.com/neutron-org/admin-module $REPOS/admin-module --branch v1.0.0 --depth 1
npx buf generate $REPOS/admin-module/proto --template $TEMPLATE --output $OUT/admin_module

# ===== cosmos-sdk ============
git clone https://github.com/neutron-org/cosmos-sdk $REPOS/cosmos-sdk --branch v0.47.6-neutron
cd $REPOS/cosmos-sdk
# git checkout v0.47.6-neutron
cd $ROOT
npx buf generate $REPOS/cosmos-sdk/proto --template $TEMPLATE --output $OUT/cosmos_sdk

# ===== ibc-go ================
git clone https://github.com/cosmos/ibc-go $REPOS/ibc-go --branch v7.3.1 --depth 1
npx buf generate $REPOS/ibc-go/proto --template $TEMPLATE --output $OUT/ibc_go

# note: commented because we don't have pob for now
# ===== block-sdk (pob) =======
# git clone git@github.com:skip-mev/block-sdk.git --branch v1.1.0 --depth 1
# npx buf generate $REPOS/block-sdk/proto --template $TEMPLATE --output $OUT/block_sdk

rm -rf $REPOS
