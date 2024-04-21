import Card from "@/components/shared/Card";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { createUser } from "@/lib/actions/user.actions";
import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

// const { onSignIn } = useClerk();
// setTimeout(SyncUser, 2000);
SyncUser();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}

async function SyncUser() {
  currentUser()
    .then(async (currentClerkUser) => {
      await connectToDatabase().then(async () => {
        const user = {
          clerkId:
            currentClerkUser?.id.toString() !== undefined
              ? currentClerkUser?.id.toString()
              : "id",
          email: currentClerkUser?.emailAddresses[0]?.emailAddress
            ? currentClerkUser.emailAddresses[0].emailAddress
            : "emailAddress",
          username: currentClerkUser?.username
            ? currentClerkUser?.username!
            : "username",
          firstName: currentClerkUser?.firstName
            ? currentClerkUser?.firstName
            : "firstName",
          lastName: currentClerkUser?.lastName
            ? currentClerkUser?.lastName!
            : "lastName",
          photo: currentClerkUser?.imageUrl
            ? currentClerkUser?.imageUrl!
            : "photo",
        };

        const findUser = await User.findOne({
          clerkId: user?.clerkId,
        });

        if (!findUser) {
          const newUser = await createUser(user);
          console.log("user created");
          if (newUser) {
            await clerkClient.users.updateUserMetadata(
              currentClerkUser?.id.toString() !== undefined
                ? currentClerkUser?.id.toString()
                : "",
              {
                publicMetadata: {
                  userId: newUser._id,
                },
              }
            );
          }
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
