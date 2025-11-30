import React from "react";
import { HeaderContainer } from "../Header/HeaderContainer";
import { FooterContainer } from "../Footer/FooterContainer";
import { Route, Routes } from "react-router-dom";
import "./style.scss";
import SignIn from "../SignIn";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import LogIn from "../LogIn";
import Profile from "../Profile";
import AddArticle from "../AddArticle";
import ProfileArticles from "../ProfileArticles";
import ArticlePage from "../ArticlePage";
import AllArticles from "../AllArticles";
import ArticlePageContainer from "../ArticlePage/ArticlePageContainer";

export const App: React.FC<any> = () => {
  return (
    <div className="app-wrapper">
      <Provider store={store}>
        <HeaderContainer />
        <div className="app-wrapper-content">
          <Routes>
            <Route path="/" element={<AllArticles />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<LogIn />} />
            <Route
              path="/article/:id"
              element={<ArticlePageContainer />}
            />
            <Route path="/all-articles" element={<AllArticles />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-article" element={<AddArticle />} />
            <Route path="/profile/:userId/articles" element={<ProfileArticles />} />
          </Routes>
        </div>
        <FooterContainer />
      </Provider>
    </div>
  );
};
