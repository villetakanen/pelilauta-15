import { createSignal, onMount, type Component } from "solid-js";
import { ProfileLink } from "./ProfileLink";
import { t } from "src/utils/i18n";

export const ProfileSelector: Component<{ exclude?: Array<string> }> = (props) => {

  const [availableProfiles, setAvailableProfiles] = createSignal<Array<string>>([]);

  onMount(async () => {
    // Fetch the list of profiles from the server
    const response = await fetch('/api/profiles');
    if (!response.ok) {
      console.error('Failed to fetch profiles', response);
      return;
    }
    const data = await response.json();
    setAvailableProfiles(Object.keys(data));
  })

  return (
    <ul class="action-list">
      {availableProfiles().map((profileKey) => (
        <li><ProfileLink profileKey={profileKey} />
          <button class="text">{t('actions:add')}</button>
        </li>
      ))}
    </ul>
  );
}