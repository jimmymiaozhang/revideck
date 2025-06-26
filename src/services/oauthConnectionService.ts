import { 
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  Timestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { OAuthConnection } from '../config/firebase';

// Update the OAuthConnection interface to be more specific about providers
type OAuthProvider = 'google' | 'facebook' | 'microsoft';

// Firestore converter for OAuthConnection type
const oauthConnectionConverter: FirestoreDataConverter<OAuthConnection> = {
  toFirestore: (connection: OAuthConnection) => {
    return {
      id: connection.id,
      accountId: connection.accountId,
      provider: connection.provider,
      providerUserId: connection.providerUserId,
      email: connection.email,
      createdAt: Timestamp.fromDate(connection.createdAt)
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return {
      id: data.id,
      accountId: data.accountId,
      provider: data.provider,
      providerUserId: data.providerUserId,
      email: data.email,
      createdAt: data.createdAt.toDate()
    } as OAuthConnection;
  }
};

class OAuthConnectionService {
  private oauthCollection = collection(db, 'oauth_connections').withConverter(oauthConnectionConverter);

  /**
   * Creates a new OAuth connection
   */
  async createConnection(
    accountId: string,
    provider: OAuthProvider,
    providerUserId: string,
    email: string
  ): Promise<OAuthConnection> {
    const connection: OAuthConnection = {
      id: crypto.randomUUID(),
      accountId,
      provider,
      providerUserId,
      email,
      createdAt: new Date()
    };

    await setDoc(doc(this.oauthCollection, connection.id), connection);
    return connection;
  }

  /**
   * Gets an OAuth connection by ID
   */
  async getConnection(id: string): Promise<OAuthConnection | null> {
    const docRef = doc(this.oauthCollection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  /**
   * Finds an OAuth connection by provider and provider user ID
   */
  async findByProviderUserId(provider: OAuthProvider, providerUserId: string): Promise<OAuthConnection | null> {
    const q = query(
      this.oauthCollection,
      where('provider', '==', provider),
      where('providerUserId', '==', providerUserId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].data();
  }

  /**
   * Finds all OAuth connections for an account
   */
  async findByAccountId(accountId: string): Promise<OAuthConnection[]> {
    const q = query(
      this.oauthCollection,
      where('accountId', '==', accountId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  }

  /**
   * Finds an OAuth connection by email
   */
  async findByEmail(email: string): Promise<OAuthConnection | null> {
    const q = query(
      this.oauthCollection,
      where('email', '==', email)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].data();
  }
}

export const oauthConnectionService = new OAuthConnectionService(); 