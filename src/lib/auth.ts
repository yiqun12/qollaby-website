import { Models, OAuthProvider } from "appwrite";
import { account, Collections, databases, Query } from "./appwrite";

export type AuthUser = Models.User<Models.Preferences>;

export interface Profile {
  $id: string;
  userId: string;
  name: string;
  profileImageUrl?: string;
  role?: string;
  [key: string]: unknown;
}

export interface WebUser {
  user: AuthUser;
  profile: Profile;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function getProfileByUserId(
  userId: string
): Promise<Profile | null> {
  try {
    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      Collections.PROFILE,
      [Query.equal("userId", userId), Query.limit(1)]
    );
    return (res.documents[0] as unknown as Profile) || null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function getProfileByUsername(
  username: string
): Promise<Profile | null> {
  try {
    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      Collections.PROFILE,
      [Query.equal("username", username.trim().toLowerCase()), Query.limit(1)]
    );
    return (res.documents[0] as unknown as Profile) || null;
  } catch (error) {
    console.error("Error fetching profile by username:", error);
    return null;
  }
}

export async function getCurrentWebUser(): Promise<WebUser | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getProfileByUserId(user.$id);
  if (!profile) return null;

  return { user, profile };
}

export async function loginWithEmail(
  identifier: string,
  password: string
): Promise<WebUser> {
  let email = identifier.trim().toLowerCase();

  if (!email.includes("@")) {
    const profile = await getProfileByUsername(email);
    if (!profile?.email) {
      throw new Error("No account found with that username");
    }
    email = profile.email as string;
  }

  await account.createEmailPasswordSession(email, password);

  const user = await account.get();
  const profile = await getProfileByUserId(user.$id);

  if (!profile) {
    await logout();
    throw new Error("User profile not found");
  }

  return { user, profile };
}

export function loginWithGoogle(): void {
  const successUrl = `${window.location.origin}/auth/callback`;
  const failureUrl = `${window.location.origin}/login?error=oauth_failed`;

  account.createOAuth2Token(OAuthProvider.Google, successUrl, failureUrl);
}

export async function handleOAuthCallback(): Promise<WebUser> {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const secret = params.get("secret");

  if (userId && secret) {
    await account.createSession(userId, secret);
  }

  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication failed");

  const profile = await getProfileByUserId(user.$id);
  if (!profile) {
    await logout();
    throw new Error("User profile not found");
  }

  return { user, profile };
}

export async function logout(): Promise<void> {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
  }
}
