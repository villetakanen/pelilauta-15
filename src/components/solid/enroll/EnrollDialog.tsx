/**
 * A Solid Enroll Dialog component.
 * 
 * If the user has logged in, and not accepted the terms of service, this dialog will be shown.
 * 
 * Pressing cancel will log the user out.
 */

import { db } from "@firebase/client";
import { useStore } from "@nanostores/solid";
import { t } from "@utils/i18n";
import { logDebug } from "@utils/logHelpers";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createEffect, type Component } from "solid-js";
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

  createEffect(async () => {
    if (!! uid()) {
      logDebug('EnrollDialog', { uid: uid() })
      // Check if the user has accepted the terms of service
      const accepted = localStorage.getItem("enroll-accepted");
      if (accepted !== uid()) {
        // Check the database
        logDebug('EnrollDialog', { uid: uid() }, 'Checking database for enrollment')
        // If not accepted, show the dialog
        const account = await getDoc(
          doc(db, "accounts", uid())
        )
        logDebug('EnrollDialog', { uid: uid() }, 'Account data:', account.data())
        if (!account.data()?.eulaAccepted) {
          // Show the dialog
          (document.getElementById("enrollDialog") as HTMLDialogElement).showModal();
        } else {
          // Update local storage
          localStorage.setItem("enroll-accepted", uid());
        }
      }
    }
  })

  async function handleAccept() {
    // Update the database
    await updateDoc(
      doc(db, "accounts", uid()),
      {
        eulaAccepted: true
      }
    )
    // Update local storage
    localStorage.setItem("enroll-accepted", uid());
    // Close the dialog
    (document.getElementById("enrollDialog") as HTMLDialogElement).close();
  }

  async function handleCancel() {
    // Remove the local storage item just in case
    localStorage.removeItem("enroll-accepted");

    // Log the user out
    await fetch("/api/auth/logout");
    
    // Close the dialog
    (document.getElementById("enrollDialog") as HTMLDialogElement).close();
  }

  return (
    <cn-dialog>
      <h3 slot="header">{t('app:enroll.title')}</h3>
      <p>{t('app:enroll.description')}</p>
      <div class="toolbar">
        <button onClick={handleCancel}>{t('app:enroll.cancel')}</button>
        <button onClick={handleAccept}>{t('app:enroll.accept')}</button>
      </div>
    </cn-dialog>
  )
}