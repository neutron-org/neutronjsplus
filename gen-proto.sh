#!/usr/bin/env bash

REPOS="./tmp_repos"
OUT="./src/proto"
TEMPLATE="./buf.ts.gen.yaml"

mkdir $REPOS

# ===== base types ============
npx buf generate buf.build/protocolbuffers/wellknowntypes --template $TEMPLATE --output $OUT/wellknowntypes --include-imports

# ===== neutron ===============
git clone https://github.com/neutron-org/neutron $REPOS/neutron --branch fix/pool_metadata_proto --depth 1
npx buf generate $REPOS/neutron/proto --template $TEMPLATE --output $OUT/neutron --include-imports
npx buf generate $REPOS/neutron/third_party/proto --template $TEMPLATE --output $OUT/neutron_thirdparty --include-imports

# ===== admin-module ==========
git clone https://github.com/neutron-org/admin-module $REPOS/admin-module --branch v1.0.0 --depth 1
npx buf generate $REPOS/admin-module/proto --template $TEMPLATE --output $OUT/admin_module --include-imports

# ===== cosmos-sdk ============
git clone https://github.com/neutron-org/cosmos-sdk $REPOS/cosmos-sdk --branch v0.47.6-neutron --depth 1
npx buf generate $REPOS/cosmos-sdk/proto --template $TEMPLATE --output $OUT/cosmos_sdk --include-imports

# ===== ibc-go ================
git clone https://github.com/cosmos/ibc-go $REPOS/ibc-go --branch v7.3.1 --depth 1
npx buf generate $REPOS/ibc-go/proto --template $TEMPLATE --output $OUT/ibc_go --include-imports

# ===== block-sdk (pob) =======
git clone git@github.com:skip-mev/block-sdk.git $REPOS/block-sdk --branch v1.1.0 --depth 1
npx buf generate $REPOS/block-sdk/proto --template $TEMPLATE --output $OUT/block_sdk --include-imports

# ===== slinky ================
# TODO: change version after ICS and audited version release
git clone git@github.com:skip-mev/slinky.git $REPOS/slinky --branch v0.3.1 --depth 1
npx buf generate $REPOS/slinky/proto --template $TEMPLATE --output $OUT/slinky --include-imports

rm -rf $REPOS
