require('dotenv').config();
const bs58 = require('bs58');
const { 
    Connection, 
    Keypair, 
    clusterApiUrl 
} = require('@solana/web3.js');
const { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo, 
    setAuthority, 
    AuthorityType 
} = require('@solana/spl-token');

async function deployDossToken() {
    // Conectando na rede principal (Mainnet) da Solana
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

    // 1. CARREGANDO A SUA CARTEIRA PHANTOM DO COFRE (.env)
    const secretKeyString = process.env.SECRET_KEY;
    if (!secretKeyString) {
        console.log("❌ ALARME OPSEC: Chave secreta não encontrada no arquivo .env");
        return;
    }
    
    // Decodificando a chave da Phantom
    const payer = Keypair.fromSecretKey(bs58.decode(secretKeyString)); 
    console.log("🚀 Commander Wallet Conectada:", payer.publicKey.toBase58());

    // Parâmetros do Token $DOSS
    const decimals = 6;
    const supply = 750000 * Math.pow(10, decimals); // Supply cravado em 750k

    console.log("🛠️ Forjando $DOSS na blockchain...");

    try {
        // 2. CRIANDO O CONTRATO (MINT)
        const mint = await createMint(
            connection,
            payer,
            payer.publicKey, // Mint Authority
            payer.publicKey, // Freeze Authority
            decimals
        );

        console.log("🟢 Token $DOSS Criado! CA:", mint.toBase58());

        // 3. CRIANDO A CONTA PARA RECEBER OS TOKENS
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
        );

        // 4. EMITINDO OS TOKENS PARA A SUA CARTEIRA
        await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            payer,
            supply
        );

        console.log(`💎 Supply de 750.000 $DOSS emitido com sucesso para a sua carteira.`);

        // 5. O GOLPE FINAL: REVOGAR AUTORIDADE DE MINT (ANTI-RUG)
        await setAuthority(
            connection,
            payer,
            mint,
            payer.publicKey,
            AuthorityType.MintTokens,
            null // Revogando o poder de criar mais tokens para sempre
        );

        console.log("🔒 Mint Authority Revogada. Supply fixado para sempre. Missão Cumprida.");
        
    } catch (error) {
        console.error("❌ ERRO NO DEPLOY:", error);
    }
}

deployDossToken();