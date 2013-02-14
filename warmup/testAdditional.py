import unittest
import os
import testLib

class TestAddUndefinedUser(testLib.RestTestCase):
	def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
		expected = { 'errCode' : errCode }
		if count is not None:
			expected['count']  = count
		self.assertDictEqual(expected, respData)

	def testAddUndefUndef(self):
		self.setUp()
		respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'thisIsNotAUser', 'password' : 'thisIsNotAPassword'} )
		print("KIRBY *************************** " + str(respData['errCode']))
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)