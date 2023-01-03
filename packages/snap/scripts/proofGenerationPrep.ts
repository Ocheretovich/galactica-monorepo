import * as fs from 'fs';

import { GenZkKycRequestParams } from '../src/types';

const binFileUtils = require('@iden3/binfileutils');
const { groth16 } = require('snarkjs');
const { zKey } = require('snarkjs');

/**
 * testStandard tests the usual proof generation process of snarkjs to compare it to the one in the snap
 *
 * @param circuitName - name of the circuit to find the files
 * @param input
 */
async function testStandard(circuitName: string, input: any) {
  const { proof, publicSignals } = await groth16.fullProve(
    input,
    `${__dirname}/../circuits/${circuitName}/${circuitName}.wasm`,
    `${__dirname}/../circuits/${circuitName}/${circuitName}.zkey`,
  );

  console.log('Proof: ');
  console.log(JSON.stringify(proof, null, 1));

  const vKey = JSON.parse(
    fs
      .readFileSync(
        `${__dirname}/../circuits/${circuitName}/${circuitName}.vkey.json`,
      )
      .toString(),
  );

  await verifyProof(proof, publicSignals, vKey);
}

/**
 * testModified constructs and checks the zkKYC proof with the modified code of snarkjs that does not depend on file reading
 *
 * @param circuitName - name of the circuit to find the files
 * @param params
 */
async function testModified(
  circuitName: string,
  params: GenZkKycRequestParams,
) {
  const { proof, publicSignals } = await groth16.fullProveMemory(
    params.input,
    params.wasm,
    params.zkeyHeader,
    params.zkeySections,
  );

  console.log('Proof: ');
  console.log(JSON.stringify(proof, null, 1));

  const vKey = JSON.parse(
    fs
      .readFileSync(
        `${__dirname}/../circuits/${circuitName}/${circuitName}.vkey.json`,
      )
      .toString(),
  );

  await verifyProof(proof, publicSignals, vKey);
}

/**
 * @description Because we can not read files inside the SES of a snap, we parse the data here
 *   to have it in typescript and be able to pass it through the RPC endpoint
 * @param circuitName - name of the circuit to find the files
 * @param input - input data TODO: remove this as the input data should be filled from the snap
 * @returns
 */
async function createCircuitData(
  circuitName: string,
  input: any,
): Promise<GenZkKycRequestParams> {
  // read the wasm file asa array.
  // It becomes a Uint8Array later, but is passed as ordinary number array through the RPC
  // TODO: use more efficient encoding
  const wasm = Uint8Array.from(
    fs.readFileSync(
      `${__dirname}/../circuits/${circuitName}/${circuitName}.wasm`,
    ),
  );

  const { fd: fdZKey, sections: sectionsZKey } = await binFileUtils.readBinFile(
    `${__dirname}/../circuits/${circuitName}/${circuitName}.zkey`,
    'zkey',
    2,
    1 << 25,
    1 << 23,
  );
  const zkeyHeader = await zKey.readHeader(fdZKey, sectionsZKey);

  const zkeySections: any[] = [];
  for (let i = 4; i < 10; i++) {
    zkeySections.push(await binFileUtils.readSection(fdZKey, sectionsZKey, i));
  }

  const params: GenZkKycRequestParams = {
    input,
    // dummy values
    wasm,
    zkeyHeader,
    zkeySections,
    requirements: {
      zkCertStandard: 'gip69',
    },
  };
  return params;
}

/**
 * @description To simplify reading the data in the frontend, we write it to a ts file here.
 * TODO: solve this properly by providing the file in the frontend and let the frontend parse it
 * @param filePath
 * @param data
 */
async function writeCircuitDataToTSFile(
  filePath: string,
  data: GenZkKycRequestParams,
) {
  // format data for writing to file (othewise arrays look like objects)
  data.zkeyHeader.q = data.zkeyHeader.q.toString();
  data.zkeyHeader.r = data.zkeyHeader.r.toString();
  for (let i = 0; i < data.zkeySections.length; i++) {
    data.zkeySections[i] = uint8ArrayToJSArray(data.zkeySections[i]);
  }
  data.zkeyHeader.vk_alpha_1 = uint8ArrayToJSArray(data.zkeyHeader.vk_alpha_1);
  data.zkeyHeader.vk_beta_1 = uint8ArrayToJSArray(data.zkeyHeader.vk_beta_1);
  data.zkeyHeader.vk_beta_2 = uint8ArrayToJSArray(data.zkeyHeader.vk_beta_2);
  data.zkeyHeader.vk_gamma_2 = uint8ArrayToJSArray(data.zkeyHeader.vk_gamma_2);
  data.zkeyHeader.vk_delta_1 = uint8ArrayToJSArray(data.zkeyHeader.vk_delta_1);
  data.zkeyHeader.vk_delta_2 = uint8ArrayToJSArray(data.zkeyHeader.vk_delta_2);

  let fileContent = `export const wasm = ${JSON.stringify(
    uint8ArrayToJSArray(data.wasm),
  )};\n`;
  fileContent += `export const zkeyHeader = ${JSON.stringify(
    data.zkeyHeader,
  )};\n`;
  fileContent += `export const zkeySections = ${JSON.stringify(
    data.zkeySections,
  )};\n`;
  await fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Written to ${filePath}`);
  });

  const jsContent = {
    wasm: uint8ArrayToJSArray(data.wasm),
    zkeyHeader: data.zkeyHeader,
    zkeySections: data.zkeySections,
  };
  await fs.writeFile(
    filePath.replace('.ts', '.json'),
    JSON.stringify(jsContent),
    (err) => {
      if (err) {
        throw err;
      }
      console.log(`Written to ${filePath}`);
    },
  );
}

/**
 * Check if a generated  zkProof is valid
 *
 * @param proof - proof data
 * @param publicSignals - public signals
 * @param vKey - verification key
 * @returns true if the proof is valid
 */
async function verifyProof(proof: any, publicSignals: any, vKey: any) {
  const res = await groth16.verify(vKey, publicSignals, proof);
  if (res === true) {
    console.log('Proof valid');
  } else {
    console.log('Invalid proof!');
  }
  return res === true;
}

/**
 *
 */
async function main() {
  const circuitName = 'ageProofZkKYC';

  const input = JSON.parse(
    fs
      .readFileSync(
        `${__dirname}/../circuits/${circuitName}/${circuitName}.input.json`,
      )
      .toString(),
  );

  // await testStandard(input);
  const params = await createCircuitData(circuitName, input);
  await testModified(circuitName, params);

  await writeCircuitDataToTSFile(
    `${__dirname}/../../site/src/data/${circuitName}.ts`,
    params,
  );
}

/**
 *
 * @param arr
 */
function uint8ArrayToJSArray(arr: Uint8Array) {
  const res: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(arr[i]);
  }
  return res;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
