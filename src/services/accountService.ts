import { 
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Account } from '../config/firebase';

// Firestore converter for Account type
const accountConverter: FirestoreDataConverter<Account> = {
  toFirestore: (account: Account) => {
    return {
      id: account.id,
      createdAt: Timestamp.fromDate(account.createdAt),
      updatedAt: Timestamp.fromDate(account.updatedAt)
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return {
      id: data.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Account;
  }
};

class AccountService {
  private accountsCollection = collection(db, 'accounts').withConverter(accountConverter);

  /**
   * Creates a new account
   */
  async createAccount(): Promise<Account> {
    const account: Account = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(this.accountsCollection, account.id), account);
    return account;
  }

  /**
   * Gets an account by ID
   */
  async getAccount(id: string): Promise<Account | null> {
    const docRef = doc(this.accountsCollection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  /**
   * Updates an account's updatedAt timestamp
   */
  async updateAccountTimestamp(id: string): Promise<void> {
    const docRef = doc(this.accountsCollection, id);
    await updateDoc(docRef, {
      updatedAt: Timestamp.fromDate(new Date())
    });
  }
}

export const accountService = new AccountService(); 