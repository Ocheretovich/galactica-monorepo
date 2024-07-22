import { ZkCertStandard } from '@galactica-net/galactica-types';
import type {
  GenZkProofParams,
  ProverData,
  ZkKYCAgeProofInput,
  BenchmarkZKPGenParams,
} from '@galactica-net/snap-api';
import { getEddsaKeyFromEntropy } from '@galactica-net/zk-certificates';
import { getEncryptionPublicKey } from '@metamask/eth-sig-util';

import proverData from '../../galactica-dapp/public/provers/exampleMockDApp.json';
import type { RpcArgs } from '../src/types';

const prover = proverData as ProverData;

export const defaultRPCRequest: RpcArgs = {
  origin: 'http://localhost:8000',
  request: {
    id: 'test-id',
    jsonrpc: '2.0',
    method: 'defaultTest',
  },
};

export const testSeedPhrase =
  'host void flip concert spare few spin advice nuclear age cigar collect';

export const testAddress = '0x53e173c619756eb6256d3ff4c7861bea5d739da1';

export const testHolderCommitment =
  '7735727246471767370788268218008649659345393646775019247808120566463753454903';
export const testEntropyHolder =
  '0xba5bc6bbb3c34947f652b6abc403d350713bbaab6bb6f90d252cfae6466d97e0';
export const testEdDSAKey = getEddsaKeyFromEntropy(testEntropyHolder);
export const testEntropyEncrypt =
  '0x06f095a41e4192bde91ed47f9b03286f2282f5416967aaa5d9b02fb85c5b1c1a';

export const testHolder = {
  holderCommitment: testHolderCommitment,
  eddsaEntropy: testEdDSAKey.toString('hex'),
  encryptionPrivKey: testEntropyEncrypt.slice(2),
  encryptionPubKey: getEncryptionPublicKey(testEntropyEncrypt.slice(2)),
};

export const testZkpParams: GenZkProofParams<ZkKYCAgeProofInput> = {
  input: {
    // most values do not matter because they are checked on-chain only
    currentTime: 1676033833,
    currentYear: '2023',
    currentMonth: '2',
    currentDay: '10',
    ageThreshold: '18',
    investigationInstitutionPubKey: [
      ['1', '2'],
      ['2', '3'],
      ['4', '5'],
    ],
    dAppAddress: '0x80c8C09868E97CF789e10666Ad10dD96639aCB6e',
  },
  requirements: {
    zkCertStandard: ZkCertStandard.ZkKYC,
    registryAddress: '0xD95efF72F06079DEcE33b18B165fc3A7a4bdc1fD',
  },
  prover,
  userAddress: testAddress,
  description: 'zkKYC check + age >= 18 check',
  publicInputDescriptions: [
    'human id',
    'user pubkey Ax',
    'user pubkey Ay',
    'proof valid',
    'verification SBT expiration',
    'encrypted fraud investigation shard institution 1',
    'encrypted fraud investigation shard institution 1',
    'encrypted fraud investigation shard institution 2',
    'encrypted fraud investigation shard institution 2',
    'encrypted fraud investigation shard institution 3',
    'encrypted fraud investigation shard institution 3',
    'merkle root',
    'current time',
    'user address',
    'current year',
    'current month',
    'current day',
    'age threshold',
    'dapp address',
    'zkKYC guardian pubkey Ax',
    'zkKYC guardian pubkey Ay',
    'institution 1 pubkey Ax',
    'institution 1 pubkey Ay',
    'institution 2 pubkey Ax',
    'institution 2 pubkey Ay',
    'institution 3 pubkey Ax',
    'institution 3 pubkey Ay',
  ],
  zkInputRequiresPrivKey: true,
};

export const benchmarkZKPGenParams: BenchmarkZKPGenParams = {
  input: {
    ...testZkpParams.input,
    // stuff that is usually filled by the snap is passed directly for the benchmark
    surname: "9394571395257706853209381240690921572244805705054092251193796665368637684518",
    forename: "12508415106905269703668517379769578980197323180488076414504369770793910945017",
    middlename: "12508415106905269703668517379769578980197323180488076414504369770793910945017",
    yearOfBirth: 1989,
    monthOfBirth: 5,
    dayOfBirth: 28,
    verificationLevel: "1",
    streetAndNumber: "2716050888916668653838085209344746272579684295509938667842974355541145165593",
    postcode: "15490214341472802343037230413947290042671105911775897810655006802854190405490",
    town: "20114455475426887223405337417481199280779025506960488506094430597747419448504",
    region: "20114455475426887223405337417481199280779025506960488506094430597747419448504",
    country: "5206272097955461433415670799568463787856046740863443717385317734933329763238",
    citizenship: "3704096963533554561380603784545722638824989796177284091907872955048029270902",
    randomSalt: "1975051497",
    expirationDate: 1779736098,
    holderCommitment: "7735727246471767370788268218008649659345393646775019247808120566463753454903",
    ax: "19716454868670534165483128976857202150635951646658132893036268827710399837351",
    ay: "12261645234571117201219868533980747370382578397784949507138599857245221357161",
    s: "889053732391586502346901836252445052660997137671113714515304207065157007440",
    r8x: "5460387796069872241523786055458402899675534725919715019398492861076134490243",
    r8y: "672258769804545409987157190707606987376201807941325804308382653176633813029",
    userAddress: "0x53e173c619756eb6256d3ff4c7861bea5d739da1",
    s2: "2339328075908637799307625887643912369866265201448129459620159353463232372362",
    r8x2: "12509006042054603772527806356626764609366896877645224156108616582309092402295",
    r8y2: "16367012129682914710857567104921083852347468242614489484569958971316970469159",
    providerAx: "5020193338611863004095502341160609003323126002347826555774497611602886778574",
    providerAy: "8272040872207888880717356773730935212440388338505052070830207190132776525135",
    providerS: "2715033121649959673187289285004675079596111163733361356259373242508449160211",
    providerR8x: "11292556198629174586123103586887957760121434295585745495446983165041952948495",
    providerR8y: "8579649781134291701281984780917512379100999132774792672598425732246111312272",
    root: "5911380264884531589827748248445597682294459441957299373568299681705011691557",
    pathElements: [
      "3420416983139679712664175897349102656840811800827473567091572628239214089774",
      "14763155090723541711102240958805819264154024874013976157761122311090829118045",
      "14160256668110176237652855315388266406606785144653806925293311761178671846740",
      "17619695615639375563172755451063681091123583187367666354590446695851847455206",
      "13318301576191812234266801152872599855532005448246358193934877587650370582600",
      "14788131755920683191475597296843560484793002846324723605628318076973413387512",
      "15889843854411046052299062847446330225099449301489575711833732034292400193334",
      "4591007468089219776529077618683677913362369124318235794006853887662826724179",
      "974323504448759598753817959892943900419910101515018723175898332400800338902",
      "10904304838309847003348248867595510063038089908778911273415397184640076197695",
      "6882370933298714404012187108159138675240847601805332407879606734117764964844",
      "5139203521709906739945343849817745409005203282448907255220261470507345543242",
      "13660695785273441286119313134036776607743178109514008645018277634263858765331",
      "10348593108579908024969691262542999418313940238885641489955258549772405516797",
      "8081407491543416388951354446505389320018136283676956639992756527902136320118",
      "9958479516685283258442625520693909575742244739421083147206991947039775937697",
      "7970914938810054068245748769054430181949287449180056729094980613243958329268",
      "9181633618293215208937072826349181607144232385752050143517655282584371194792",
      "4290316886726748791387171617200449726541205208559598579274245616939964852707",
      "6485208140905921389448627555662227594654261284121222408680793672083214472411",
      "9758704411889015808755428886859795217744955029900206776077230470192243862856",
      "2597152473563104183458372080692537737210460471555518794564105235328153976766",
      "3463902188850558154963157993736984386286482462591640080583231993828223756729",
      "4803991292849258082632334882589144741536815660863591403881043248209683263881",
      "8436762241999885378816022437653918688617421907409515804233361706830437806851",
      "1050020814711080606631372470935794540279414038427561141553730851484495104713",
      "12563171857359400454610578260497195051079576349004486989747715063846486865999",
      "15261846589675849940851399933657833195422666255877532937593219476893366898506",
      "3948769100977277285624942212173034288901374055746067204399375431934078652233",
      "5165855438174057791629208268983865460579098662614463291265268210129645045606",
      "19766134122896885292208434174127396131016457922757580293859872286777805319620",
      "21875366546070094216708763840902654314815506651483888537622737430893403929600"
    ],
    leafIndex: 2,
    userPrivKey: "3635533317792728501315700624679462031504427385475015664421777617317783930947"
  },
  prover,
};

export const merkleProofServiceURL =
  'https://merkle-proof-service.galactica.com/v1/galactica/';
