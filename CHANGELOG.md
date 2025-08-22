# [1.6.0](https://github.com/Quackoloc/api/compare/v1.5.0...v1.6.0) (2025-08-22)


### Features

* **ci:** update ci.yml to run integration tests in pgsql db ([6d21b11](https://github.com/Quackoloc/api/commit/6d21b11d01ae2b166147778c87c9558955bfc865))
* **cron:** [QUAC-79] Quand le cron se déclanche, il doit récupérer les colocation qui doivent avoir leur date de rotation mise à jour, mais également les colocations qui n'ont pas été traitées ([ac1d773](https://github.com/Quackoloc/api/commit/ac1d7738fc3ce4c16e58a33a58d82e89e53250f9))
* **tasks:** [QUAC-80] Je veux pouvoir paramétrer les tâches récurrentes de ma colocation ([0cebc26](https://github.com/Quackoloc/api/commit/0cebc266563d20c9fee994b32ed1eff0aba508f4))
* **tests:** add integration tests on repositories ([1f2eb34](https://github.com/Quackoloc/api/commit/1f2eb34302d39d5c9e012cd774e21b23f0cf8780))
* **user:** [QUAC-58] ETQU, quand je créé un compte j'ai une image de profil avec mes initiales ([bc7a088](https://github.com/Quackoloc/api/commit/bc7a088d6c715d40e15725fa1040fe143d4a8aaa))
* **user:** [QUAC-76] ETQU, je veux pouvoir mettre à jour mon mot de passe ([d5624b9](https://github.com/Quackoloc/api/commit/d5624b97b86a73494b989a42fd616ef808aee3a8))

# [1.5.0](https://github.com/Quackoloc/api/compare/v1.4.0...v1.5.0) (2025-08-07)


### Bug Fixes

* **migrations:** generate first migration from empty database ([086f324](https://github.com/Quackoloc/api/commit/086f3240f0248b9f5e2492eaefc52fb8007fc678))


### Features

* **ci:** [QUAC-55] Lancer les tests / check lint / check format à chaque push sur le repo distant ([c3c8e21](https://github.com/Quackoloc/api/commit/c3c8e216240e04891cc7a7c4d7ea0b05858811f2))
* **task:** [QUAC-62] Faire la route pour supprimer une tâche ([a9d35cf](https://github.com/Quackoloc/api/commit/a9d35cf794f5c29e06f3d43f4b83dc8e9c1cf1d3))
* **tasks:** [QUAC-45] ETQU, quand je créé une tâche récurrente, je veux qu'elle soit assignée à la personne qui a le moins de tâches ([9034c04](https://github.com/Quackoloc/api/commit/9034c04d8f48c5551f3e49c9fe0944f0b2b8e37d))
* **user:** [QUAC-74] ETQU, je veux pouvoir mettre à jour mon profil ([9182b90](https://github.com/Quackoloc/api/commit/9182b9064906817ffc9520b97abeccf43559f367))

# [1.5.0](https://github.com/Quackoloc/api/compare/v1.4.0...v1.5.0) (2025-08-05)


### Bug Fixes

* **migrations:** generate first migration from empty database ([086f324](https://github.com/Quackoloc/api/commit/086f3240f0248b9f5e2492eaefc52fb8007fc678))


### Features

* **ci:** [QUAC-55] Lancer les tests / check lint / check format à chaque push sur le repo distant ([c3c8e21](https://github.com/Quackoloc/api/commit/c3c8e216240e04891cc7a7c4d7ea0b05858811f2))
* **task:** [QUAC-62] Faire la route pour supprimer une tâche ([a9d35cf](https://github.com/Quackoloc/api/commit/a9d35cf794f5c29e06f3d43f4b83dc8e9c1cf1d3))
* **tasks:** [QUAC-45] ETQU, quand je créé une tâche récurrente, je veux qu'elle soit assignée à la personne qui a le moins de tâches ([9034c04](https://github.com/Quackoloc/api/commit/9034c04d8f48c5551f3e49c9fe0944f0b2b8e37d))

# [1.4.0](https://github.com/Quackoloc/api/compare/v1.3.1...v1.4.0) (2025-07-17)


### Bug Fixes

* **test:** fix logger in tests ([b7e7eea](https://github.com/Quackoloc/api/commit/b7e7eeab02fefcad9d0d30f1aa2e1865366c7c05))


### Features

* **ci:** add clever deploy to ci ([7eca1d6](https://github.com/Quackoloc/api/commit/7eca1d67d29453162eec9d8ba56e0ba8f81833fd))
* **ci:** add prettier & ESLint check ([9b12a57](https://github.com/Quackoloc/api/commit/9b12a57ffa2ee0f0c36a226f2fc20b19f717a5b1))
* **logger:** improve logger format to have timestamp first ([acc9ca0](https://github.com/Quackoloc/api/commit/acc9ca093db97e8f38b19fdfa1ea33a9c833c1ae))
* **tasks:** [QUAC-49] Gérer le mode automatique de rotation des tâches ([c7c4b22](https://github.com/Quackoloc/api/commit/c7c4b2230066ab7c6b97dd910a2b7673bac9ae33))
* **tasks:** [QUAC-49]: Gérer le mode automatique de rotation des tâches ([3ab9a74](https://github.com/Quackoloc/api/commit/3ab9a7488348642f6adaf21fc3307781234e48ae))
* **tools:** add sentry ([858d98f](https://github.com/Quackoloc/api/commit/858d98fad048b3195643b7783e0f1ac48882077f))

## [1.3.1](https://github.com/Quackoloc/api/compare/v1.3.0...v1.3.1) (2025-06-24)


### Bug Fixes

* **ci:** remove Docker build & push steps ([a3cd156](https://github.com/Quackoloc/api/commit/a3cd156564e70625ed1ba42ccb57b351a5ca065c))

# [1.3.0](https://github.com/Quackoloc/api/compare/v1.2.1...v1.3.0) (2025-06-15)


### Features

* **auth:** implement logout route ([45e9de8](https://github.com/Quackoloc/api/commit/45e9de82fcc73ce88fd7952a8b9532cce349e3a1))
* **colocation:** [QUAC-47] Créer les routes pour créer/récupérer/éditer une tâche ([0817ec9](https://github.com/Quackoloc/api/commit/0817ec9d2b8cc89986a467ce7ad36f272b6814c5))
* **task:** update task status, update tests & add PUT to cors ([b999f6c](https://github.com/Quackoloc/api/commit/b999f6ce907109a72d750ca2bd764b437d580ab6))

## [1.2.1](https://github.com/Quackoloc/api/compare/v1.2.0...v1.2.1) (2025-06-13)


### Bug Fixes

* **healthcheck:** add [@get](https://github.com/get) / route to avoir 404 errors with clever cloud healthcheck ([ed77c25](https://github.com/Quackoloc/api/commit/ed77c25144e5f03a54f3c030b47d765e9ea8b4c7))

# [1.2.0](https://github.com/Quackoloc/api/compare/v1.1.1...v1.2.0) (2025-06-13)


### Features

* **colocation:** update join colocation code route which not requires colocation id anymore ([7e048e1](https://github.com/Quackoloc/api/commit/7e048e184722620470d8b03c645d5f96c1a13ba6))
* **logs:** add logger in use cases for user actions ([76d2751](https://github.com/Quackoloc/api/commit/76d27513b5d46798647b00090cc4083840dbc985))

## [1.1.1](https://github.com/Quackoloc/api/compare/v1.1.0...v1.1.1) (2025-06-13)


### Bug Fixes

* **auth:** correct cors error ([f45a831](https://github.com/Quackoloc/api/commit/f45a83153fd194e2115a5d6767bb79582af23f42))

# [1.1.0](https://github.com/Quackoloc/api/compare/v1.0.0...v1.1.0) (2025-06-13)


### Features

* **auth:** update auth method (use cookie instead of returning the tokens in the json response) ([b8a59f4](https://github.com/Quackoloc/api/commit/b8a59f463ed7a39610af53d51c0eced01311a3b0))
* **colocation:** [QUAC-37] ETQU, je veux pouvoir personnaliser l’apparence (logo, couleurs) de la colocation pour renforcer son identité ([3bd55dc](https://github.com/Quackoloc/api/commit/3bd55dc0ba07524bd647229b0026411e55b00382))
* **colocation:** [QUAC-45] ETQU, je veux pouvoir rejoindre une colocation existante via code ([e6acd80](https://github.com/Quackoloc/api/commit/e6acd8002c3535a65bf15c86deef72a067157ca3))
* **tests:** add missing unit tests for use-cases ([4cfd887](https://github.com/Quackoloc/api/commit/4cfd887a98aa9e72565e95cd6ad1244bf98878fa))

# 1.0.0 (2025-06-11)


### Features

* **auth:** [QUAC-43] Créer les routes de register/login sur l'API ([e42fdd3](https://github.com/Quackoloc/api/commit/e42fdd3ca4c99eb1b51be082325ceb28e7b300c4))
* **deploy:** Premier déploiement ([7cf95f8](https://github.com/Quackoloc/api/commit/7cf95f8431dab91421a90fdd3de9cec7a714d19c))
