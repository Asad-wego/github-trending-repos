/*
 * Created by Asad on 21 Nov 2024
 */

import React from "react";
import { useTranslation } from "react-i18next";
import "./RepoItem.css";

interface Props {
  repo: Repository;
}

const RepoItem: React.FC<Props> = React.memo(
  ({ repo: { owner, name, description, stargazers_count } }) => {
    const { t } = useTranslation();
    return (
      <div className="repo-item">
        <img
          loading="lazy"
          src={owner.avatar_url}
          alt={`${owner.login}'s avatar`}
        />
        <div className="details">
          <h3>{name}</h3>
          <p>{description || t("no_description_available")}</p>
          <div className="info">
            <span>👤 {owner.login}</span>
            <span className="stars">⭐ {stargazers_count}</span>
          </div>
        </div>
      </div>
    );
  }
);

export default RepoItem;
