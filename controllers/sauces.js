const express = require("express");
const Sauce = require("../models/sauces");
const fs = require("fs");
const { error } = require("console");

//Fonction permettant la création d'une sauce + ajout à la BDD
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce crée!" }))
    .catch((error) => res.status(400).json({ error }));
};

//Fonction permettant l'affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Fonction permettant l'affichage d'une seule sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

//Fonction permettant la modification d'une sauce
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(400).json({ message: "cette sauce n'existe pas!" });
      }
      if (sauce.userId != req.auth.userId) {
        return res.status(403).json({ message: "requête non autorisée" });
      }
      const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      Sauce.updateOne(
        { _id: req.params.id, userId: req.auth.userId },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "sauce modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction permettant la suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  // protection contre la suppression d'une sauce par un autre utilisateur
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({ message: "cette sauce n'existe pas" });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ message: "requête non autorisée" });
      }

      // suppression de l'image du dossier image à la supression d'une sauce
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "sauce supprimée!" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })

    .catch((error) => res.status(500).json({ error }));
};

// Gestion du système de likes,dislikes
exports.likeSystem = (req, res, next) => {
  // test de tous les cas possibles
  switch (req.body.like) {
    // ajout d'un like
    case 1:
      // incrémentation du nombre de likes + ajout de l'utilisateur qui like
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
      )
        .then(() =>
          res.status(200).json({ message: "vous aimez cette sauce!" })
        )
        .catch((error) => res.status(400).json({ error }));

      break;

    //Ajout d'un dislike
    case -1:
      // incrémentation du nombre de dislikes + ajout de l'utilisateur qui dislike
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
      )
        .then(() =>
          res.status(200).json({ message: "vous n'aimez pas cette sauce!" })
        )
        .catch((error) => res.status(400).json({ error }));
      break;

    // Annulation d'un like ou dislike
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          // si l'utilisateur n'est pas présent dans le tableau des dislikes
          if (sauce.usersDisliked.indexOf(req.body.userId) != -1) {
            Sauce.updateOne(
              { _id: req.params.id },
              // retrait de l'utilisateur du tableau usersDisliked + décrémentation du dislike
              {
                $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 },
              }
            )
              .then(() => res.status(200).json({ message: "aucun avis" }))
              .catch((error) => res.status(400).json({ error }));
          }
          // si l'utilisateur n'est pas présent dans le tableau des likes
          if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
            Sauce.updateOne(
              { _id: req.params.id },
              // retrait de l'utilisateur du tableau usersliked + décrémentation du like
              { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: "aucun avis" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));

    default:
      break;
  }
};
