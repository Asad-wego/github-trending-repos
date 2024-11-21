/*
 * Created by Asad on 21 Nov 2024
 */

// TODO: Future development, Currently extracted required keys from the API response.
// Ignore any extra data that isn't required for the current functionality.

interface Owner {
  login: string;
  avatar_url: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  owner: Owner;
}
