import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    field => field.id === product.categoryId,
  );
  const user = usersFromServer.find(
    persone => persone.id === category?.ownerId,
  );

  return { ...product, user, category };
});

export const App = () => {
  const [userId, setUserId] = useState(null);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState([]);

  const filterProducts = filters => {
    let filteredProducts = [...products];

    if (filters.userId) {
      filteredProducts = filteredProducts.filter(
        product => product.user.id === filters.userId,
      );
    }

    if (filters.query) {
      const lowerQuery = filters.query.toLowerCase();

      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(lowerQuery),
      );
    }

    if (filters.categoryId.length !== 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.categoryId.includes(product.categoryId),
      );
    }

    return filteredProducts;
  };

  const resetFilters = () => {
    setUserId(null);
    setQuery('');
    setCategoryId([]);
  };

  const addCategory = newCategoryId => {
    setCategoryId(currentCategoryIds => [...currentCategoryIds, newCategoryId]);
  };

  const removeCategory = newCategoryId => {
    setCategoryId(currentCategoryIds =>
      currentCategoryIds.filter(category => category !== newCategoryId),
    );
  };

  const visibleProducts = filterProducts({
    userId,
    query,
    categoryId,
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setUserId(null)}
                className={cn({
                  'is-active': userId === null,
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setUserId(user.id)}
                  className={cn({
                    'is-active': user.id === userId,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': categoryId.length !== 0,
                })}
                onClick={() => setCategoryId([])}
              >
                All
              </a>

              {categoriesFromServer.map(category =>
                categoryId.includes(category.id) ? (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className="button mr-2 my-1 is-info"
                    href="#/"
                    onClick={() => removeCategory(category.id)}
                  >
                    {category.title}
                  </a>
                ) : (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className="button mr-2 my-1"
                    href="#/"
                    onClick={() => addCategory(category.id)}
                  >
                    {category.title}
                  </a>
                ),
              )}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">No results</p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
