/**
 * Created by Matijas on 11.04.2017.
 */

import { isDevelop } from "../js/helper/util";

export default {
    BASE_URL: isDevelop() ? 'https://jsonplaceholder.typicode.com/' : 'https://jsonplaceholder.typicode.com/',
    BASE_URL_CARS: isDevelop() ? 'http:/localhost:3000/' : 'http:/localhost:3000/'

}