'use strict';

module.exports = [
  {
    name: 'Deposit',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      {
        type: 'uint256',
        name: 'value',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'Withdraw',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      {
        type: 'uint256',
        name: 'value',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'UpdateLiquidityLimit',
    inputs: [
      { type: 'address', name: 'user', indexed: false },
      {
        type: 'uint256',
        name: 'original_balance',
        indexed: false,
      },
      { type: 'uint256', name: 'original_supply', indexed: false },
      {
        type: 'uint256',
        name: 'working_balance',
        indexed: false,
      },
      { type: 'uint256', name: 'working_supply', indexed: false },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    outputs: [],
    inputs: [
      { type: 'address', name: 'lp_addr' },
      { type: 'address', name: '_minter' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    name: 'user_checkpoint',
    outputs: [{ type: 'bool', name: '' }],
    inputs: [{ type: 'address', name: 'addr' }],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 2079152,
  },
  {
    name: 'claimable_tokens',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'address', name: 'addr' }],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 1998318,
  },
  {
    name: 'kick',
    outputs: [],
    inputs: [{ type: 'address', name: 'addr' }],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 2084532,
  },
  {
    name: 'set_approve_deposit',
    outputs: [],
    inputs: [
      { type: 'address', name: 'addr' },
      { type: 'bool', name: 'can_deposit' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 35766,
  },
  {
    name: 'deposit',
    outputs: [],
    inputs: [{ type: 'uint256', name: '_value' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    name: 'deposit',
    outputs: [],
    inputs: [
      { type: 'uint256', name: '_value' },
      { type: 'address', name: 'addr' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    name: 'withdraw',
    outputs: [],
    inputs: [{ type: 'uint256', name: '_value' }],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 2208318,
  },
  {
    name: 'integrate_checkpoint',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2297,
  },
  {
    name: 'minter',
    outputs: [{ type: 'address', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1421,
  },
  {
    name: 'crv_token',
    outputs: [{ type: 'address', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1451,
  },
  {
    name: 'lp_token',
    outputs: [{ type: 'address', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1481,
  },
  {
    name: 'controller',
    outputs: [{ type: 'address', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1511,
  },
  {
    name: 'voting_escrow',
    outputs: [{ type: 'address', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1541,
  },
  {
    name: 'balanceOf',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'address', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function',
    gas: 1725,
  },
  {
    name: 'totalSupply',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1601,
  },
  {
    name: 'future_epoch_time',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1631,
  },
  {
    name: 'approved_to_deposit',
    outputs: [{ type: 'bool', name: '' }],
    inputs: [
      { type: 'address', name: 'arg0' },
      { type: 'address', name: 'arg1' },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 1969,
  },
  {
    name: 'working_balances',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'address', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function',
    gas: 1845,
  },
  {
    name: 'working_supply',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1721,
  },
  {
    name: 'period',
    outputs: [{ type: 'int128', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1751,
  },
  {
    name: 'period_timestamp',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'uint256', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function',
    gas: 1890,
  },
  {
    name: 'integrate_inv_supply',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'uint256', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function',
    gas: 1920,
  },
  {
    name: 'integrate_inv_supply_of',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'address', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function',
    gas: 1995,
  },
  {
    name: 'integrate_checkpoint_of',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'address', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function',
    gas: 2025,
  },
  {
    name: 'integrate_fraction',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'address', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function',
    gas: 2055,
  },
  {
    name: 'inflation_rate',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1931,
  },
];
