import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { auth } from "@clerk/nextjs/server";
import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "./database";
import User from "./database/models/user.model";
import { createUser, updateUser } from "./actions/user.actions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return formattedPrice;
};

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const handleError = (error: unknown) => {
  console.error(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

export async function SyncUser() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  console.log(userId);
  currentUser()
    .then(async (currentClerkUser) => {
      await connectToDatabase().then(async () => {
        // console.log(currentClerkUser);
        if (currentClerkUser != null) {
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

          // const findUser = await User?.findOne({
          //   clerkId: user?.clerkId,
          // });

          // if (!findUser) {
          //   const newUser = await createUser(user);
          //   console.log("user created");
          //   if (newUser) {
          //     await clerkClient.users.updateUserMetadata(
          //       currentClerkUser?.id.toString() !== undefined
          //         ? currentClerkUser?.id.toString()
          //         : "",
          //       {
          //         publicMetadata: {
          //           userId: newUser._id,
          //         },
          //       }
          //   );
          // }
          // }
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function SyncUserUpdate() {
  currentUser()
    .then(async (currentClerkUser) => {
      var id =
        currentClerkUser?.id.toString() !== undefined
          ? currentClerkUser?.id.toString()
          : "id";
      const user = {
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

      const updatedUser = await updateUser(id, user);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
