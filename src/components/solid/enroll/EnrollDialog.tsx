/**
 * A Solid Enroll Dialog component.
 * 
 * If the user has logged in, and not accepted the terms of service, this dialog will be shown.
 * 
 * Pressing cancel will log the user out.
 */

import { db } from "@firebase/client";
import { useStore } from "@nanostores/solid";
import { doc, getDoc } from "firebase/firestore";
import { createEffect, createSignal, type Component } from "solid-js";
import { $uid } from "src/store/SessionStore";

export const EnrollDialog: Component = () => {


  // If we get an UID, the user is logged in - check if the
  // enrollment has been accepted from local storage
  //
  // if not, we need to check the database
  //
  // if not, we need to show the dialog
  // -> if the user accepts, we need to update the database, and local storage
  // -> if the user cancels, we need to log the user out
  const uid = useStore($uid);
  const [show, setShow] = createSignal(false);

  const onUidChange = createEffect(async () => {
    if (!! uid()) {
      // Check if the user has accepted the terms of service
      const accepted = localStorage.getItem("enroll-accepted");
      if (accepted !== uid()) {
        // Check the database
        // If not accepted, show the dialog
        const account = await getDoc(
          doc(db, "accounts", uid())
        )
        if (!account.data()?.eulaAccepted) {
          // Show the dialog
          setShow(true);
        }
      }
    }
  })

  return (
    <cn-dialog show={show()}>

    </cn-dialog>
  )
}